import type { NextPage } from "next";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { Switch } from "@headlessui/react";

import { Layout } from "./components/Layout";
import { CONTACT_FORM_SUBMIT_URL } from "./constants";
import { isValidEmail } from "./utils";
import { Snackbar } from "./components/Snackbar";

const initialFormValues = {
  name: "",
  organization: "",
  email: "",
  message: "",
};

const Contacto: NextPage = () => {
  const [isPrivacyPolicyAccepted, setIsPrivacyPolicyAccepted] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSubmissionOk, setIsFormSubmissionOk] = useState<boolean>();
  const isFormValid =
    formValues.name.length > 0 &&
    formValues.email.length > 0 &&
    isValidEmail(formValues.email) &&
    formValues.message.length > 0 &&
    isPrivacyPolicyAccepted === true;

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsFormSubmitting(true);

    const formData = new FormData();

    Object.entries(formValues).map(([key, value]) =>
      formData.append(key, value)
    );

    fetch(CONTACT_FORM_SUBMIT_URL, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setFormValues(initialFormValues);
          setIsFormSubmissionOk(true);
          setIsPrivacyPolicyAccepted(false);
        } else {
          setIsFormSubmissionOk(false);
        }
      })
      .catch(() => {
        setIsFormSubmissionOk(false);
      })
      .finally(() => setIsFormSubmitting(false));
  };

  const handleSnackbarClose = () => {
    setIsFormSubmissionOk(undefined);
  };

  return (
    <Layout title="Contacto">
      <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-xl mx-auto mb-20">
          <h1 className="text-4xl leading-10 font-extrabold tracking-tight text-gray-900 text-center sm:text-5xl sm:leading-none lg:text-6xl">
            Hablemos
          </h1>
          <p className="mt-6 text-xl leading-normal text-gray-500 text-center">
            No dudes en contactarme si tienes algún proyecto entre manos y crees
            que te puedo ayudar con él.
          </p>
        </div>
        <div className="relative max-w-xl mx-auto">
          <svg
            className="absolute left-full transform translate-x-1/2"
            width={404}
            height={404}
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={404}
              fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
            />
          </svg>
          <svg
            className="absolute right-full bottom-0 transform -translate-x-1/2"
            width={404}
            height={404}
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={404}
              fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
            />
          </svg>

          <form
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
            onSubmit={handleFormSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 border-[1px] border-gray-300 rounded-md"
                  value={formValues.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-gray-700"
              >
                Empresa{" "}
                <span className="text-gray-400 font-normal">- opcional</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  autoComplete="organization"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 border-[1px] border-gray-300 rounded-md"
                  value={formValues.organization}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 border-[1px] border-gray-300 rounded-md"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Mensaje
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={8}
                  className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 border-[1px] border-gray-300 rounded-md"
                  value={formValues.message}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Switch
                    checked={isPrivacyPolicyAccepted}
                    onChange={setIsPrivacyPolicyAccepted}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 bg-gray-50 border-[1px] border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isPrivacyPolicyAccepted ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span className="sr-only">Agree to policies</span>
                    <span
                      aria-hidden="true"
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        isPrivacyPolicyAccepted
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </Switch>
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-500">
                    He leído y acepto la{" "}
                    <a href="#" className="font-medium text-gray-700 underline">
                      política de privacidad
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400"
                disabled={isFormSubmitting || !isFormValid}
              >
                {isFormSubmitting && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isFormSubmitting ? "Enviando" : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {isFormSubmissionOk === true && (
        <Snackbar
          type="success"
          message="Yuju! El mensaje se ha enviado correctamente."
          onClose={handleSnackbarClose}
        />
      )}
      {isFormSubmissionOk === false && (
        <Snackbar
          type="error"
          message="Oops! Ha ocurrido un error al enviar el mensaje."
          onClose={handleSnackbarClose}
        />
      )}
    </Layout>
  );
};

export default Contacto;
