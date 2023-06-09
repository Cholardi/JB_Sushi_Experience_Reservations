const multiStepForm = document.querySelector("[data-multi-step]");
let formSteps = [...multiStepForm.querySelectorAll("[data-step]")];

const comensalesSelect = document.getElementById("comensales");
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
let mesaSelectedOption = mesa.options[mesa.selectedIndex];

multiStepForm.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        // keyCode 13 is the "Enter" key
        event.preventDefault(); // prevent form submission
    }
});

mesa.addEventListener("change", () => {
    disablePlatosArea();
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

                        <div class="personalizacion-menu">
                            <div class="platos-area">
                                <label for="entrada">Elegí una entrada:</label>
                                <select id="entrada" name="entrada_${i}">
                                    <option value="harumakis">Classic Harumakis</option>
                                    <option value="harumakis_spicy">Harumakis & Spicy Hot Sauce (Picante)</option>
                                    <option value="cazuela">Cazuela de Ceviche</option>
                                </select>

                                <label for="principal">Plato principal:</label>
                                <select id="principal" name="principal_${i}">
                                    <option value="sushi">Sushi de Autor (16u.)</option>
                                </select>

                                <label for="postre">Elegí un postre:</label>
                                <select id="postre" name="postre_${i}">
                                    <option value="chocotorta">Chocotorta</option>
                                    <option value="tiramisu">Tiramisú</option>
                                    <option value="lincoln">Lincoln Pie</option>
                                </select>
                            </div>

                            <div class="vertical-separator-line"></div>

                            <div class="requerimientos-area">
                                <label for="checkboxes-requerimientos">Seleccioná en caso que aplique: </label>
                                <div class="checkboxes-requerimientos">
                                    <div class="checkbox-option">
                                        <label for="vegano">Vegano/a</label>
                                        <input type="checkbox" id="vegano" name="vegano_${i}" value="vegano" />
                                    </div>
                                    <div class="checkbox-option">
                                        <label for="vegetariano">Vegetariano/a</label>
                                        <input type="checkbox" id="vegetariano" name="vegetariano_${i}" value="vegetariano" />
                                    </div>
                                    <div class="checkbox-option">
                                        <label for="celiaco">Celíaco/a</label>
                                        <input type="checkbox" id="celiaco" name="celiaco_${i}" value="celiaco" />
                                    </div>
                                </div>

                                <div>
                                    <label for="otros-requerimientos">Otras aclaraciones:</label>
                                    <textarea id="otros-requerimientos" name="otros-requerimientos_${i}"></textarea>
                                </div>
                            </div>
                        </div>

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

    disablePlatosArea();
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
    mesaSelectedOption = mesa.options[mesa.selectedIndex];
    expPrice = mesaSelectedOption.getAttribute("data-price");
    expName = mesaSelectedOption.textContent.replace(/\s-\s\$\d+/, ""); // Gets the text of the selected option element and removes the text inside the span element.
    totalDue = numComensales * expPrice;
    horario = horarioReserva.value;

    horarioReservaReview.textContent = horario;
    cantComensalesReview.textContent = numComensales;
    tipoExperienciaReview.textContent = `${expName} ($${expPrice}/persona)`;
    totalDueReview.textContent = `$${totalDue}`;
    totalDueSubmitted.value = `$${totalDue}`;
}

function disablePlatosArea() {
    mesaSelectedOption = mesa.options[mesa.selectedIndex];
    const platosArea = document.querySelectorAll(".platos-area");
    const verticalSeparatorLine = document.querySelectorAll(".vertical-separator-line");

    if (mesaSelectedOption.value == "omakase") {
        platosArea.forEach((platosArea) => {
            platosArea.classList.add("hide");
        });
        verticalSeparatorLine.forEach((verticalSeparatorLine) => {
            verticalSeparatorLine.classList.add("hide");
        });
    } else {
        platosArea.forEach((platosArea) => {
            platosArea.classList.remove("hide");
        });
        verticalSeparatorLine.forEach((verticalSeparatorLine) => {
            verticalSeparatorLine.classList.remove("hide");
        });
    }
}
