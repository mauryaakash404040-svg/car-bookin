const form =
  document.getElementById("bookingForm");

const message =
  document.getElementById("formMessage");

const carSelect =
  document.getElementById("car");


// ===============================
// BOOK THIS CAR BUTTON
// ===============================

document
  .querySelectorAll(".book-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      const selectedCar =
        button.dataset.car;

      carSelect.value = selectedCar;

      document
        .getElementById("booking")
        .scrollIntoView({
          behavior: "smooth"
        });

    });

  });


// ===============================
// BOOKING FORM
// ===============================

form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    message.textContent =
      "Saving booking...";

    message.className = "";


    // Form data
    const formData =
      new FormData(form);


    const data =
      Object.fromEntries(
        formData.entries()
      );


    try {

      const response =
        await fetch(
          "/api/bookings",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(data)
          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
          "Booking failed"
        );

      }


      // Success
      message.textContent =
        result.message;

      message.className =
        "success";


      // Reset form
      form.reset();


    } catch (error) {

      console.error(error);

      message.textContent =
        error.message ||
        "Server connection failed";

      message.className =
        "error";

    }

  }
);