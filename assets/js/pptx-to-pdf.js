/**
 * PPTX to PDF Converter
 * Features:
 * - Upload PPTX or PPT
 * - Preview slides immediately on upload
 * - Convert PPTX to PDF on button click
 * - Download PDF
 * Author: Saeed Ahmed Sheikh
 */

const { jsPDF } = window.jspdf;

(function () {

    // ------------------ DOM References ------------------
    const pptxInput = document.getElementById('pptxInput');
    const convertBtn = document.getElementById('convertPptxBtn');
    const pptxPreview = document.getElementById('pptxPreview');
    const pdfPanel = document.getElementById('pdfPanel');
    const pdfPreview = document.getElementById('pdfPreview');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const toast = document.getElementById('toastPptx');

    let uploadedPptxFile = null;
    let slideImages = [];
    let currentSlideIndex = 0;
    let thumbImages = [];
    let generatedPdf = null;

    // ------------------ Upload PPTX and Preview Slides ------------------
    pptxInput.addEventListener('change', async function (event) {
        const file = event.target.files[0];
        if (!file) return;

        uploadedPptxFile = file;

        pptxPreview.innerHTML = '<div class="small">Loading slides...</div>';

        try {
            const arrayBuffer = await uploadedPptxFile.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);
            const slideEntries = Object.keys(zip.files)
                .filter(f => f.startsWith('ppt/slides/slide') && f.endsWith('.xml'));

            slideImages = [];

            // Create placeholder slide images (replace with proper slide rendering if needed)
            for (let i = 0; i < slideEntries.length; i++) {
                const canvas = document.createElement('canvas');
                canvas.width = 960;
                canvas.height = 540;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000';
                ctx.font = '20px Arial';
                ctx.fillText(`Slide ${i + 1}`, 400, 270);
                const imgData = canvas.toDataURL('image/png');
                slideImages.push(imgData);
            }

            createSlideViewer();

            convertBtn.disabled = false;
            showToast('📂 PPTX uploaded and preview ready!');
        } catch (err) {
            alert('Error loading PPTX: ' + err.message);
        }
    });

    // ------------------ Convert PPTX to PDF ------------------
    convertBtn.addEventListener('click', function () {
        if (!slideImages.length) return;

        generatedPdf = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [960, 540]
        });

        slideImages.forEach((img, idx) => {
            if (idx > 0) generatedPdf.addPage();
            generatedPdf.addImage(img, 'PNG', 0, 0, 960, 540);
        });

        // Show PDF in preview
        const pdfBlob = generatedPdf.output('blob');
        const pdfURL = URL.createObjectURL(pdfBlob);

        pdfPreview.innerHTML = `<iframe src="${pdfURL}" style="width:100%;height:24.3rem;border:1px solid #ccc;border-radius:6px;"></iframe>`;
        pdfPanel.classList.add('visible');               // make visible
        pdfPanel.scrollIntoView({ behavior: 'smooth' }); // scroll to it

        exportPdfBtn.disabled = false;
        showToast('✅ PDF generated!');
    });

    // ------------------ Download PDF ------------------
    exportPdfBtn.addEventListener('click', function () {
        if (!generatedPdf) return;

        generatedPdf.save('converted.pdf');
        showToast('✅ PDF downloaded!');
    });

    // ------------------ Create Slide Viewer ------------------
    function createSlideViewer() {
        pptxPreview.innerHTML = '';

        const viewer = document.createElement('div');
        viewer.style.display = 'flex';
        viewer.style.border = '1px solid #ccc';
        viewer.style.borderRadius = '8px';
        viewer.style.overflow = 'hidden';
        viewer.style.background = '#fff';

        // Thumbnails
        const thumbs = document.createElement('div');
        thumbs.style.width = '100px';
        thumbs.style.overflowY = 'auto';
        thumbs.style.borderRight = '1px solid #ccc';
        thumbs.style.background = '#f8f8f8';
        thumbs.style.padding = '5px';

        thumbImages = slideImages.map((img, idx) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.style.width = '100%';
            thumb.style.cursor = 'pointer';
            thumb.style.marginBottom = '5px';
            thumb.style.border = idx === 0 ? '2px solid #007bff' : '2px solid transparent';

            thumb.addEventListener('click', () => {
                showSlide(idx);
                thumbs.scrollTop = thumb.offsetTop - thumbs.offsetTop;
            });

            thumbs.appendChild(thumb);
            return thumb;
        });

        // Main slide panel
        const mainSlide = document.createElement('div');
        mainSlide.style.minWidth = '0';
        mainSlide.style.display = 'flex';
        mainSlide.style.alignItems = 'center';
        mainSlide.style.justifyContent = 'center';
        mainSlide.style.background = '#fff';
        mainSlide.style.overflow = 'hidden';

        const slideImg = document.createElement('img');
        slideImg.id = 'currentSlide';
        slideImg.src = slideImages[0];
        slideImg.style.width = '100%';
        slideImg.style.height = '100%';
        slideImg.style.objectFit = 'contain';
        mainSlide.appendChild(slideImg);

        viewer.appendChild(thumbs);
        viewer.appendChild(mainSlide);
        pptxPreview.appendChild(viewer);

        // Slide number
        const slideNumber = document.createElement('div');
        slideNumber.id = 'slideNumber';
        slideNumber.style.textAlign = 'center';
        slideNumber.style.padding = '5px';
        slideNumber.textContent = `1 / ${slideImages.length}`;
        pptxPreview.appendChild(slideNumber);

        // Prevent page scroll while scrolling thumbnails
        thumbs.addEventListener('wheel', function (event) {
            event.preventDefault();
            thumbs.scrollTop += event.deltaY;
        });
    }

    // ------------------ Show Slide ------------------
    function showSlide(index) {
        currentSlideIndex = Math.max(0, Math.min(index, slideImages.length - 1));
        document.getElementById('currentSlide').src = slideImages[currentSlideIndex];

        thumbImages.forEach((img, idx) => {
            img.style.border = idx === currentSlideIndex ? '2px solid #007bff' : '2px solid transparent';
        });

        document.getElementById('slideNumber').textContent = `${currentSlideIndex + 1} / ${slideImages.length}`;
    }

    // ------------------ Toast ------------------
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

})();
