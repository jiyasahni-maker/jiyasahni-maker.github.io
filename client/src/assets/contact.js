// ============================
// CONTACT FORM FINAL JS
// Supports:
// - Web3Forms Submission
// - Validation
// - Error message handling
// - Success hologram animation
// ============================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("cyberForm");
    const fields = form.querySelectorAll(".field");
    const success = document.getElementById("formSuccess");

    // ============================
    // FIELD VALIDATION FUNCTION
    // ============================
    function validateField(field) {
        const input = field.querySelector("input, textarea");
        const error = field.querySelector(".error");

        if (!input.value.trim()) {
            error.textContent = "Required";
            return false;
        }

        if (input.type === "email") {
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
            if (!emailValid) {
                error.textContent = "Invalid email";
                return false;
            }
        }

        error.textContent = "";
        return true;
    }

    // Validate on input
    fields.forEach(field => {
        const input = field.querySelector("input, textarea");
        input.addEventListener("input", () => validateField(field));
    });

    // ============================
    // FORM SUBMIT HANDLER
    // ============================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let valid = true;

        // Check all fields
        fields.forEach(field => {
            if (!validateField(field)) {
                valid = false;
            }
        });

        // Error animation
        if (!valid) {
            form.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(-8px)" },
                    { transform: "translateX(8px)" },
                    { transform: "translateX(0)" }
                ],
                { duration: 220 }
            );
            return;
        }

        // ============================
        // SUBMIT THROUGH WEB3FORMS
        // ============================
        const formData = new FormData(form);

        try {
            const res = await fetch(form.action, {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Network response failed");

            // ============================
            // SUCCESS STATE + HOLOGRAM ANIMATION
            // ============================
            success.textContent = "✨ Transmission Sent Successfully ✦";
            success.style.opacity = "1";

            form.animate(
                [
                    { opacity: 1, transform: "scale(1)" },
                    { opacity: 0.6, transform: "scale(1.02)" },
                    { opacity: 1, transform: "scale(1)" }
                ],
                { duration: 600, easing: "ease-out" }
            );

            form.reset();

            setTimeout(() => {
                success.style.opacity = "0";
            }, 3200);

        } catch (error) {
            success.textContent = "⚠ Transmission Failed — Try Again";
            success.style.opacity = "1";

            setTimeout(() => {
                success.style.opacity = "0";
            }, 3000);
        }
    });
});
