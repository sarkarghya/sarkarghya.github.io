import { React } from 'react';

const ContactPreview = () => {
  return (
    <article className="landing__contact">
      <h2 className="title-font pink-text h2-tag">Contact Me</h2>
      <p className="white-text p-tag">
        Please feel free to email me if you are interested in my work, want help or advise.
        I am also open to short calendly calls.
        I always strive to improve so I encourage you to admonish anonymously <a href="https://forms.gle/2zquxjHuKTeijjPX6" style={{ color: '#00eeff' }}>here</a>.
      </p>
      {/* <ContactForm /> */}
    </article>
  );
};

export default ContactPreview;
