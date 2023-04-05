const multiStepForm = document.querySelector("[data-multi-step]");
let formSteps = [...multiStepForm.querySelectorAll("[data-step]")];

const comensalesSelect = document.getElementById("comensales");
const formContainer = document.querySelector(".form-container");
const cantComensalesReview = document.getElementById("cant-comensales-review");
const tipoExperienciaReview = document.getElementById("tipo-experiencia-review");
const mesa = document.getElementById("mesa");
const totalDueReview = document.getElementById("total-due-review");
const totalDueSubmitted = document.getElementById("total-due");

const firstNextButton = document.getElementById("first-next-btn");

const horarioReserva = document.getElementById("hora");
const horarioReservaReview = document.getElementById("horario-reserva");


let horario = horarioReserva.value;
let numComensales = comensalesSelect.value;
// let expPrice = selectedOption.getAttribute("data-price");
// console.log(expPrice);
// let totalDue = numComensales * expPrice;

multiStepForm.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        // keyCode 13 is the "Enter" key
        event.preventDefault(); // prevent form submission
    }
});

mesa.addEventListener("change", () => {
    outputReview();
});

comensalesSelect.addEventListener("change", () => {
    outputReview();

    // Remove existing pag3 element
    const existingPag3 = document.querySelectorAll(".pag3");
    existingPag3.forEach((page) => page.remove());

    // Create new pag3_x elements based on numComensales
    for (let i = 1; i <= numComensales; i++) {
        const newPage = document.createElement("div");
        newPage.classList.add("form-page", "pag3", `sub${i}`);
        newPage.dataset.step = "";
        newPage.innerHTML = `
                        <div class="form-titles">
                            <h2 class="comensal_num">COMENSAL ${i}</h2>
                            <h3>Personalizá tu experiencia</h3>
                        </div>

                        <label for="entrada">Elegí una entrada:</label>
                        <select id="entrada" name="entrada">
                            <option value="1">Opción 1</option>
                            <option value="2">Opción 2</option>
                            <option value="3">Opción 3</option>
                        </select>

                        <label for="principal">Plato principal:</label>
                        <select id="principal" name="principal">
                            <option value="1">Opción 1</option>
                        </select>

                        <label for="postre">Elegí un postre:</label>
                        <select id="postre" name="postre">
                            <option value="1">Opción 1</option>
                            <option value="2">Opción 2</option>
                            <option value="3">Opción 3</option>
                        </select>

                        <label for="checkboxes-requerimientos">Seleccioná en caso que aplique: </label>
                        <div class="checkboxes-requerimientos">
                            <div class="checkbox-option">
                                <label for="vegano">Vegano/a</label>
                                <input type="checkbox" id="vegano" name="requerimientos_${i}" value="vegano" />
                            </div>
                            <div class="checkbox-option">
                                <label for="vegetariano">Vegetariano/a</label>
                                <input type="checkbox" id="vegetariano" name="requerimientos_${i}" value="vegetariano" />
                            </div>
                            <div class="checkbox-option">
                                <label for="celiaco">Celíaco/a</label>
                                <input type="checkbox" id="celiaco" name="requerimientos_${i}" value="celiaco" />
                            </div>
                        </div>

                        <label for="otros-requerimientos">Otras aclaraciones:</label>
                        <textarea id="otros-requerimientos" name="otros-requerimientos_${i}"></textarea>

                        <div class="button-box">
                            <button type="button" class="btn btn-back" data-previous>
                                <i class="bi bi-arrow-left-circle"></i>
                                <span class="btn-text">Atrás</span>
                            </button>
                            <button type="button" class="btn btn-next" data-next>
                                <span class="btn-text">Siguiente</span>
                                <i class="bi bi-arrow-right-circle"></i>
                            </button>
                        </div>
    `;
        multiStepForm.insertBefore(newPage, multiStepForm.lastElementChild);
    }

    formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
});

let currentStep = formSteps.findIndex((step) => {
    return step.classList.contains("active");
});

if (currentStep < 0) {
    currentStep = 0;
    showCurrentStep();
}

multiStepForm.addEventListener("click", (e) => {
    let incrementor;
    if (e.target.matches("[data-next]")) {
        incrementor = 1;
    } else if (e.target.matches("[data-previous]")) {
        incrementor = -1;
    }

    if (incrementor == null) return;

    const inputs = [...formSteps[currentStep].querySelectorAll("input")];
    const allValid = inputs.every((input) => input.reportValidity());
    if (allValid || e.target.matches("[data-previous]")) {
        currentStep += incrementor;
        showCurrentStep();
    }
});

formSteps.forEach((step) => {
    step.addEventListener("animationend", (e) => {
        formSteps[currentStep].classList.remove("hide");
        e.target.classList.toggle("hide", !e.target.classList.contains("active"));
    });
});

firstNextButton.addEventListener("click", () => {
    outputReview();
});

function showCurrentStep() {
    formSteps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
    });
}

function outputReview() {
    numComensales = comensalesSelect.value;
const selectedOption = mesa.options[mesa.selectedIndex];
    expPrice = selectedOption.getAttribute("data-price");
    expName = mesa.value;
    totalDue = numComensales * expPrice;
    horario = horarioReserva.value;

    horarioReservaReview.textContent = horario;
    cantComensalesReview.textContent = numComensales;
    tipoExperienciaReview.textContent = `${expName} - Valor por persona: $${expPrice}`;
    totalDueReview.textContent = `$${totalDue}`;
    totalDueSubmitted.value = `$${totalDue}`;
}
