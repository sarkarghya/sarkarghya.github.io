import { useEffect, React } from "react";
import { Footer } from "../../components";
import ContactForm from "./ContactForm";
import "./Contact.sass";
const Contact = () => {
  useEffect(() => {
    document.title = "Contact | Arghya Sarkar";
    window.scrollTo(0, 0);
  })
  return (
    <main className="contact">
      <h2 className="title-font pink-text h2-tag">Contact Me</h2>
      <p className="white-text p-tag">
      Please feel free to email me if you are interested in my work, want help or advise.
      I am also open to short calendly calls.
      </p>
      <ContactForm />
      <Footer />
    </main>
  );
};

export default Contact;
