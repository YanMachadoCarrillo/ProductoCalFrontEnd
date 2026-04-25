document.getElementById('calculatorForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const errorDiv = document.getElementById('globalError');
    const resultContainer = document.getElementById('resultContainer');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnSubmit = document.getElementById('btnCalcular');

    const costoBase = parseFloat(document.getElementById('costoBase').value);
    const descuento = parseFloat(document.getElementById('descuento').value);
    const iva = parseFloat(document.getElementById('iva').value);

    // UI Reset
    errorDiv.style.display = 'none';
    resultContainer.style.display = 'none';
    btnText.innerText = 'Calculando...';
    btnSpinner.style.display = 'inline-block';
    btnSubmit.disabled = true;

    try {
        // IMPORTANTE: Eliminamos el /api/ y usamos /calcular
        const response = await fetch('https://productocal.onrender.com/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                base_cost: costoBase,
                discount: descuento,
                vat: iva
            })
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("El servidor no encuentra la ruta /calcular. Verifica el Backend.");
            }
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Error del servidor: ${response.status}`);
        }

        const data = await response.json();

        // Formateo y visualización (Tu lógica original)
        const formatter = new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP', minimumFractionDigits: 2
        });

        document.getElementById('resNombre').innerText = document.getElementById('nombre').value;
        document.getElementById('resBase').innerText = formatter.format(data.base_cost);
        document.getElementById('resDescuento').innerText = '-' + formatter.format(data.discount_amount);
        document.getElementById('resSubtotal').innerText = formatter.format(data.discounted_price);
        document.getElementById('resIva').innerText = '+' + formatter.format(data.vat_amount);
        document.getElementById('resFinal').innerText = formatter.format(data.final_price);

        resultContainer.style.display = 'block';

    } catch (error) {
        console.error("Error detectado:", error);
        errorDiv.innerText = error.message;
        errorDiv.style.display = 'block';
    } finally {
        btnText.innerText = 'Calcular Precio';
        btnSpinner.style.display = 'none';
        btnSubmit.disabled = false;
    }
});
