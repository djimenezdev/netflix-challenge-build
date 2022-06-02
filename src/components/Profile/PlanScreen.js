import { useState, useEffect } from "react";
import "../../Styles/PlanScreen.css";
import { db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";
import {
  getRole,
  getStatus,
  getInfo,
  getData,
  getCheck,
} from "../../features/subscriptionSlice";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";

const PlanScreen = () => {
  const [products, setProducts] = useState([]);
  const userInfo = useSelector(selectUser);
  const subInfo = useSelector(getData);
  const [sub, setSub] = useState(null);

  const dispatch = useDispatch();
  const [value] = useCollection(
    db.collection("products").where("active", "==", true)
  );

  const [subscriptionData] = useCollection(
    db
      .collection("customers")
      .doc(userInfo?.uid)
      .collection("subscriptions")
      .where("status", "in", ["trialing", "active"])
  );
  useEffect(() => {
    const priceData = () => {
      let productData =
        value &&
        value?.docs?.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));

      let priceDataM = [];
      productData?.map((product) =>
        db
          .collection("products")
          .doc(product.id)
          .collection("prices")
          .onSnapshot((snap) => {
            priceDataM.push(
              snap.docs.map((doc) => ({
                data: doc.data(),
                id: doc.id,
              }))
            );
            if (productData.length === priceDataM.length) {
              setProducts([productData, priceDataM]);
            }
          })
      );
    };
    priceData();
  }, [value]);

  useEffect(() => {
    subscriptionData?.docs?.map(async (sub) => {
      if (
        sub.data().trial_start &&
        (sub.data().cancel_at_period_end || sub.data().ended_at)
      ) {
        dispatch(getCheck({ check: true }));
        dispatch(getRole({ role: "trial ended" }));
        dispatch(getStatus({ status: "trial ended" }));
        setSub({
          role: "trial ended",
          current_period_end: null,
          current_period_start: null,
          status: "trial ended",
          canceled_at: sub.data().canceled_at,
          ended_at: sub.data().ended_at,
        });
      } else {
        dispatch(
          getRole({
            role: !sub.data().canceled_at ? sub.data().role : "not active",
          })
        );
        dispatch(
          getStatus({
            status: !sub.data().canceled_at ? sub.data().status : "not active",
          })
        );
        setSub({
          role: !sub.data().canceled_at ? sub.data().role : "not active",
          current_period_end: sub.data().current_period_end.seconds,
          current_period_start: sub.data().current_period_start.seconds,
          status: !sub.data().canceled_at ? sub.data().status : "not active",
          canceled_at: sub.data().canceled_at,
        });
      }
    });
  }, [subscriptionData, dispatch]);

  useEffect(() => {
    if (products.length > 0 && subInfo?.subInfoM?.length === 0) {
      const option = products[0]?.filter(
        (plan) => plan.data.role === subInfo?.role
      );
      if (option.length > 0) {
        const { data } = option[0];
        const { name, description } = data;
        dispatch(getInfo({ info: [name, description] }));
      }
    }
  }, [products, dispatch, subInfo]);

  const loadCheckout = async (priceID) => {
    const docRef = await db
      .collection("customers")
      .doc(userInfo.uid)
      .collection("checkout_sessions")
      .add({
        trial_from_plan: false,
        price: `${priceID}`,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(`A error occured: ${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51ILLTiILXCju1gYHZNZBrNbJQcNXwC4cvlrRCdqYkUHjP3zb1zGygVYSFAuudIGUCyQCZWwMckOnFEGYN0XWnURf00sst90to5"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  const basicPlanTrial = async () => {
    const docRef = await db
      .collection("customers")
      .doc(userInfo.uid)
      .collection("checkout_sessions")
      .add({
        trial_from_plan: true,
        price: `${products.length > 0 && products[1][0][0].id}`,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(`A error occured: ${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51ILLTiILXCju1gYHZNZBrNbJQcNXwC4cvlrRCdqYkUHjP3zb1zGygVYSFAuudIGUCyQCZWwMckOnFEGYN0XWnURf00sst90to5"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  const ManagePlan = async () => {
    const functionRef = firebase
      .app()
      .functions("us-west2")
      .httpsCallable("ext-firestore-stripe-subscriptions-createPortalLink");
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);
  };

  return (
    <div className="planScreen">
      {subInfo?.role !== "not active" &&
        subInfo?.role !== "trial ended" &&
        subInfo?.role !== null && (
          <p>
            Renewal Date:{" "}
            {new Date(sub?.current_period_end * 1000).toLocaleDateString()}
          </p>
        )}
      {products?.length > 0 &&
        products[0].map((prod, index) => {
          //  ref to each product data product
          //  ref to each product price data: products[1][index][0]
          const isCurrentPackage = prod.data.name
            ?.toLowerCase()
            .includes(sub?.role);

          return (
            <div
              key={`${prod.id}-${index}`}
              className={`${
                isCurrentPackage && "planScreen__plan--disabled"
              } planScreen__plan`}
            >
              <div className="planScreen__info">
                <h5>{prod.data.name}</h5>
                <h6>{prod.data.description}</h6>
              </div>
              <button
                type="button"
                onClick={() =>
                  !isCurrentPackage && loadCheckout(products[1][index][0].id)
                }
              >
                {isCurrentPackage
                  ? `Current Package ${
                      sub.status === "trialing"
                        ? "-(trial)"
                        : !sub.status
                        ? null
                        : ""
                    }`
                  : "Subscribe"}
              </button>
            </div>
          );
        })}

      {subInfo?.subInfoM?.length > 0 &&
        subInfo?.packageStatus !== "trialing" &&
        !sub?.canceled_at && (
          <div className="planScreen__manage">
            <h3>Manage Active Plan</h3>
            <div>
              <div className="planScreen__manageDesc">
                <h5>{subInfo.subInfoM[0]}</h5>
                <h6>{subInfo.subInfoM[1]}</h6>
              </div>
              <button type="button" onClick={ManagePlan}>
                Manage Plan
              </button>
            </div>
          </div>
        )}

      <div className="planScreen__trial">
        <h3>Trial</h3>
        {!sub?.status && !subInfo?.check ? (
          <div>
            <div className="planScreen__trialDesc">
              <h5>Basic Plan Trial</h5>
              <h6>720p</h6>
            </div>
            <button type="button" onClick={basicPlanTrial}>
              Try Basic Plan Trial!
            </button>
          </div>
        ) : sub?.status !== "trailing" && subInfo?.check ? (
          <p>Cannot use trial</p>
        ) : sub?.status === "trialing" && !subInfo?.check ? (
          <div>
            <div className="planScreen__trialDesc">
              <h5>Basic Plan Trial</h5>
              <h6>720p</h6>
            </div>
            <button type="button" onClick={ManagePlan}>
              Manage Basic Plan Trial!
            </button>
          </div>
        ) : sub?.status !== "not active" && !subInfo?.check ? (
          <p>No need for trial. Already have active subscription</p>
        ) : sub?.status === "not active" && !subInfo?.check ? (
          <div>
            <div className="planScreen__trialDesc">
              <h5>Basic Plan Trial</h5>
              <h6>720p</h6>
            </div>
            <button type="button" onClick={basicPlanTrial}>
              Try Basic Plan Trial!
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PlanScreen;
