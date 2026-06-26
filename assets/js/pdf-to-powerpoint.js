// ------------------ DOM References ------------------
const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const pdfPreview = document.getElementById('pdfPreview');

const powerpointPanel = document.getElementById('powerpointPanel');
const powerpointPreview = document.getElementById('powerpointPreview');
const exportPptxBtn = document.getElementById('exportPptxBtn');
const toast = document.getElementById('toast');

let uploadedPdfFile = null;
let currentPptxBlob = null;
let slideImages = [];
let currentSlideIndex = 0;
let thumbImages = [];

// ------------------ Upload PDF ------------------
fileInput.addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (!file) return;

    uploadedPdfFile = file;
    convertBtn.disabled = false;

    let pdfURL = URL.createObjectURL(file);
    pdfPreview.innerHTML = `<iframe src="${pdfURL}" style="width:100%;height:24.3rem;border:1px solid #ccc;border-radius:6px;"></iframe>`;
});

// ------------------ Convert PDF → PPTX ------------------
convertBtn.addEventListener('click', async function() {
    if (!uploadedPdfFile) return;

    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';
    powerpointPreview.innerHTML = '<div class="small">Converting PDF to PPTX slides...</div>';

    try {
        let pdfData = await uploadedPdfFile.arrayBuffer();
        let pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        let pptx = new PptxGenJS();
        slideImages = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            let page = await pdf.getPage(i);
            let viewport = page.getViewport({ scale: 2 });

            let canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            let ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;

            let imgData = canvas.toDataURL('image/png');
            slideImages.push(imgData);

            let slide = pptx.addSlide();
            slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
        }

        let arrayBuffer = await pptx.write('arraybuffer');
        currentPptxBlob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });

        exportPptxBtn.disabled = false;

        createSlideViewer();

        powerpointPanel.classList.add('visible');
        powerpointPanel.scrollIntoView({ behavior: 'smooth' });

        showToast('✅ PowerPoint conversion successful!');
    } catch (err) {
        alert('Conversion failed: ' + err.message);
    }

    convertBtn.disabled = false;
    convertBtn.textContent = '🔄 Convert to PowerPoint';
});

// ------------------ Create Slide Viewer ------------------
function createSlideViewer() {
    powerpointPreview.innerHTML = '';

    let viewer = document.createElement('div');
    viewer.style.display = 'flex';
    viewer.style.border = '1px solid #ccc';
    viewer.style.borderRadius = '8px';
    viewer.style.overflow = 'hidden';
    viewer.style.background = '#fff';

    // Thumbnails
    let thumbs = document.createElement('div');
    thumbs.style.width = '100px';
    thumbs.style.overflowY = 'auto';
    thumbs.style.borderRight = '1px solid #ccc';
    thumbs.style.background = '#f8f8f8';
    thumbs.style.padding = '5px';

    thumbImages = slideImages.map(function(img, idx) {
        let thumb = document.createElement('img');
        thumb.src = img;
        thumb.style.width = '100%';
        thumb.style.cursor = 'pointer';
        thumb.style.marginBottom = '5px';
        thumb.style.border = idx === 0 ? '2px solid #007bff' : '2px solid transparent';

        thumb.addEventListener('click', function() {
            showSlide(idx);
            thumbs.scrollTop = thumb.offsetTop - thumbs.offsetTop; // Scroll thumbnail into view
        });

        thumbs.appendChild(thumb);
        return thumb;
    });

    // Main slide panel
    let mainSlide = document.createElement('div');
    mainSlide.style.flex = '1 1 auto';       // allow it to expand fully
    mainSlide.style.minWidth = '0';          // fix flex shrinking issue
    mainSlide.style.display = 'flex';
    mainSlide.style.alignItems = 'center';
    mainSlide.style.justifyContent = 'center';
    mainSlide.style.background = '#fff';
    mainSlide.style.overflow = 'hidden';


    let slideImg = document.createElement('img');
    slideImg.id = 'currentSlide';
    slideImg.src = slideImages[0];
    slideImg.style.width = '100%';
    slideImg.style.height = '100%';
    slideImg.style.objectFit = 'contain';
    mainSlide.appendChild(slideImg);

    viewer.appendChild(thumbs);
    viewer.appendChild(mainSlide);
    powerpointPreview.appendChild(viewer);

    // Slide number
    let slideNumber = document.createElement('div');
    slideNumber.id = 'slideNumber';
    slideNumber.style.textAlign = 'center';
    slideNumber.style.padding = '5px';
    slideNumber.textContent = `1 / ${slideImages.length}`;
    powerpointPreview.appendChild(slideNumber);

    // Prevent page scroll while scrolling thumbnails
    thumbs.addEventListener('wheel', function(event) {
        event.preventDefault();
        thumbs.scrollTop += event.deltaY;
    });
}

// ------------------ Show Slide ------------------
function showSlide(index) {
    currentSlideIndex = Math.max(0, Math.min(index, slideImages.length - 1));
    document.getElementById('currentSlide').src = slideImages[currentSlideIndex];

    thumbImages.forEach(function(img, idx) {
        img.style.border = idx === currentSlideIndex ? '2px solid #007bff' : '2px solid transparent';
    });

    document.getElementById('slideNumber').textContent = `${currentSlideIndex + 1} / ${slideImages.length}`;
}

// ------------------ Export PPTX ------------------
exportPptxBtn.addEventListener('click', function() {
    if (!currentPptxBlob) {
        alert('⚠️ No PPTX generated yet!');
        return;
    }

    let link = document.createElement('a');
    link.href = URL.createObjectURL(currentPptxBlob);
    link.download = 'converted.pptx';
    link.click();
    URL.revokeObjectURL(link.href);

    showToast('✅ PowerPoint downloaded!');
});

// ------------------ Toast ------------------
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2000);
}
