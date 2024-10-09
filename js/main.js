const url = 'pdf/confissao-de-fe-de-westminster.pdf'; // Caminho correto para o PDF
const pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;

const canvas = document.getElementById('pdf-canvas');
const context = canvas.getContext('2d');
const pageInfo = document.getElementById('page-info');

const renderPage = (num) => {
    pdfDoc.getPage(num).then(page => {
        const scale = 1.5; // Ajuste a escala conforme necessário
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        return page.render(renderContext).promise;
    }).catch(err => {
        console.error('Erro ao renderizar a página:', err);
    });
};

const loadPDF = () => {
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        document.getElementById('next').disabled = currentPage >= pdfDoc.numPages;
        pageInfo.textContent = `Página ${currentPage} de ${pdfDoc.numPages}`;
        renderPage(currentPage);
    }).catch(err => {
        console.error('Erro ao carregar o PDF:', err);
    });
};

document.getElementById('next').addEventListener('click', () => {
    if (currentPage < pdfDoc.numPages) {
        currentPage++;
        renderPage(currentPage);
        document.getElementById('prev').disabled = currentPage === 1;
        document.getElementById('next').disabled = currentPage >= pdfDoc.numPages;
        pageInfo.textContent = `Página ${currentPage} de ${pdfDoc.numPages}`;
    }
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        document.getElementById('next').disabled = currentPage >= pdfDoc.numPages;
        document.getElementById('prev').disabled = currentPage === 1;
        pageInfo.textContent = `Página ${currentPage} de ${pdfDoc.numPages}`;
    }
});

// Carregar o PDF assim que a página for carregada
window.onload = loadPDF;