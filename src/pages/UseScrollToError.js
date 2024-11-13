import { useEffect } from "react";

const UseScrollToError = (formik) => {
  useEffect(() => {
    const scrollToError = (errors) => {
      const errorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${errorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }
    };

    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      scrollToError(formik.errors);
    }
  }, [formik.submitCount]);
};

export default UseScrollToError;
