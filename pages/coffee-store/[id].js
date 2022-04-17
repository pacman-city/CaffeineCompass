import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import cn from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function CoffeeStore(initialProps) {
   const router = useRouter();
   const id = router.query.id;
   const {
      state: { coffeeStores },
   } = useContext(StoreContext);
   const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
   const [votingCount, setVotingCount] = useState(0);

   const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
   useEffect(() => {
      if (data && data.length > 0) {
         setCoffeeStore(data[0]);
         setVotingCount(data[0].voting);
      }
   }, [data]);

   const handleCreateCoffeeStore = async (coffeeStore) => {
      try {
         const { id, name, voting, imgUrl, neighbourhood, address } =
            coffeeStore;
         const response = await fetch("/api/createCoffeeStore", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               id,
               name,
               voting: 0,
               imgUrl,
               neighbourhood: neighbourhood || "",
               address: address || "",
            }),
         });
         const dbCoffeeStore = await response.json();
      } catch (err) {
         console.error("Error creating coffee store", err);
      }
   };

   useEffect(() => {
      if (isEmpty(initialProps.coffeeStore)) {
         if (coffeeStores.length > 0) {
            const coffeeStoreFromContext = coffeeStores.find(
               (coffeeStore) => coffeeStore.id === id.toString()
            );

            if (coffeeStoreFromContext) {
               setCoffeeStore(coffeeStoreFromContext);
               handleCreateCoffeeStore(coffeeStoreFromContext);
            }
         }
      } else {
         handleCreateCoffeeStore(initialProps.coffeeStore);
      }
   }, [id, initialProps.coffeeStore]); //eslint-disable-line

   if (router.isFallback) return <div>Loading...</div>;
   if (error) return <div>Something went wrong</div>;

   const { name, address, neighbourhood, imgUrl } = coffeeStore;

   const handleUpvoteButton = async () => {
      try {
         const response = await fetch("/api/favouriteCoffeeStoreById", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
         });
         const dbCoffeeStore = await response.json();

         if (dbCoffeeStore && dbCoffeeStore.length > 0)
            setVotingCount(votingCount + 1);
      } catch (err) {
         console.error("Error upvoting", err);
      }
   };

   return (
      <div className={styles.layout}>
         <Head>
            <title>{name}</title>
         </Head>

         <main className="main">
            <Link href="/">
               <a className={cn(styles.backToHomeLink, "glass")}>
                  ← Back to home
               </a>
            </Link>
            <h1 className={styles.name}>{name}</h1>

            <div className={styles.container}>
               <Image
                  className={styles.storeImg}
                  src={
                     imgUrl ||
                     "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  width={600}
                  height={360}
                  alt={name}
               />

               <div className={cn(styles.col2, "glass")}>
                  <div className={styles.iconWrapper}>
                     <Image
                        src="/static/icons/places.svg"
                        width={24}
                        height={24}
                        alt="icon"
                     />
                     <p className={styles.text}>{address}</p>
                  </div>
                  {neighbourhood && (
                     <div className={styles.iconWrapper}>
                        <Image
                           src="/static/icons/nearMe.svg"
                           width={24}
                           height={24}
                           alt="icon"
                        />
                        <p className={styles.text}>{neighbourhood}</p>
                     </div>
                  )}
                  <div className={styles.iconWrapper}>
                     <Image
                        src="/static/icons/star.svg"
                        width={24}
                        height={24}
                        alt="icon"
                     />
                     <p className={styles.text}>{votingCount}</p>
                  </div>
                  <button
                     className={styles.upvoteButton}
                     onClick={handleUpvoteButton}
                  >
                     Up vote!
                  </button>
               </div>
            </div>
         </main>
      </div>
   );
}

export const getStaticProps = async (context) => {
   const coffeeStores = await fetchCoffeeStores();
   const { params } = context;
   const { id } = params;
   const findCoffeeStoreById = coffeeStores.find(
      (coffeeStore) => coffeeStore.id === id.toString()
   );

   return {
      props: { coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {} },
   };
};

export const getStaticPaths = async (context) => {
   const coffeeStores = await fetchCoffeeStores();
   const paths = coffeeStores.map((s) => ({ params: { id: s.id } }));

   return {
      paths: paths,
      fallback: true,
   };
};
