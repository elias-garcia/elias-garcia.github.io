import React from "react";

import { useContactFormStyles } from "./contact-form.styles";
import { Button } from "../../shared/button/button.component";

export const ContactForm: React.FC = () => {
  const classes = useContactFormStyles();

  return (
    <form className={classes.contactForm}>
      <div className={classes.formGroup}>
        <label className={classes.label} htmlFor="name">
          Nombre
        </label>
        <input className={classes.input} id="name" placeholder="John Doe" />
      </div>
      <div className={classes.formGroup}>
        <label className={classes.label} htmlFor="email">
          Email
        </label>
        <input
          className={classes.input}
          id="email"
          placeholder="johndoe@gmail.com"
        />
      </div>
      <div className={classes.formGroup}>
        <label className={classes.label} htmlFor="message">
          Mensaje
        </label>
        <textarea
          className={classes.input}
          id="message"
          placeholder="Hola Elías! Me pongo en contacto contigo porque..."
          rows={8}
        />
      </div>
      <Button component="button" label="Enviar" type="submit" />
    </form>
  );
};
