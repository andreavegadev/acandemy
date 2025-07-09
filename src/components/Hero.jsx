import styles from "./Hero.module.css";
import heroImage from "../assets/images/dog-hero.png"; // Foto de perro feliz con productos, por ejemplo
import Heading from "./Heading";
import { ButtonPrimary } from "./Button";
import ResponsiveLayout from "./ResponsiveLayout";

const Hero = () => {
  return (
    <section className={styles.hero}>
    <div className={styles.overlay}></div>
      <ResponsiveLayout>
        <div className={styles.content}>
          <div>
            <Heading>Todo para consentir a tu mejor amigo</Heading>
            <p>Encuentra los mejores productos para perros en Acandemy.</p>
            <ButtonPrimary
              href="/products"
              overMedia
              fullWidth
            >
              Ver Productos
            </ButtonPrimary>
          </div>

          <div className={styles.imageContainer}>
            <img src={heroImage} alt="Perro feliz con productos" />
          </div>
        </div>
      </ResponsiveLayout>
    </section>
  );
};

export default Hero;
