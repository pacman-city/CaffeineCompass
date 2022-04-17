import Image from "next/image";
import Link from "next/link";
import styles from "./card.module.css";
import cn from "classnames";

export default function Card(props) {
   return (
      <Link href={props.href}>
         <a className={cn(styles.cardLink, "glass")}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
            <Image
               className={styles.cardImage}
               src={props.imgUrl}
               width={600}
               height={350}
               alt="coffe banner"
            />
         </a>
      </Link>
   );
}
