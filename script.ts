const form = document.getElementById("mainform") as HTMLFormElement;
const result = document.getElementById("result") as HTMLDivElement;
const formData = new FormData(form);
const a: number = Number(formData.get("aname"));
const b: number = Number(formData.get("bname"));
const c: number = Number(formData.get("cname"));
const d: number = Number(formData.get("dname"));
let zoom: number = 30;


function canvaLoad(scale: number, a: number, b: number, c: number, d: number) {
    const canvas = document.getElementById("graph") as HTMLCanvasElement;
    const width: number = 400;
    const height: number = 400;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.resetTransform();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2)
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.translate(width / 2, height / 2);
    ctx.beginPath();
    let y: number = 0;
    ctx.lineWidth = 3;
    for (let i = -width / 2; i <= width; i++) {
        const x = i / scale;
        y = -((a * (x ** 3)) + (b * (x ** 2)) + (c * x) + d) * scale
        if (i === -width / 2) {
            ctx.moveTo(i, y);
        } else {
            ctx.lineTo(i, y);
        }

    }
    ctx.strokeStyle = "red";
    ctx.stroke();
}

function zoomOut () {
zoom = zoom - 2;
canvaLoad(zoom,a,b,c,d);
}


function zoomIn () {
zoom = zoom + 2;
canvaLoad(zoom,a,b,c,d);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const pv = document.getElementById("pv") as HTMLParagraphElement;
    const qv = document.getElementById("qv") as HTMLParagraphElement;
    const dv = document.getElementById("dv") as HTMLParagraphElement;
    const r1v = document.getElementById("r1v") as HTMLParagraphElement;
    const r2v = document.getElementById("r2v") as HTMLParagraphElement;
    const r3v = document.getElementById("r3v") as HTMLParagraphElement;

    const p: number = ((3 * a * c) - (b ** 2)) / (3 * (a ** 2));
    const q: number = ((27 * a * d) - (9 * a * b * c) + (2 * (b ** 3))) / (27 * (a ** 3));
    const discriminant: number = ((q / 2) ** 2) + ((p / 3) ** 3);
    let root1: number = 0;
    let root2: number = 0;
    let root3: number = 0;



    function cardanoMethod(p: number, q: number) {
        const u: number = Math.cbrt(((-q) / 2) + Math.sqrt(discriminant));
        const v: number = Math.cbrt(((-q) / 2) - Math.sqrt(discriminant));
        return (u + v) - (b / (3 * a));
    }

    function rootsDom(r1: string, r2: string, r3: string) {
        r1v.innerHTML = r1;
        r2v.innerHTML = r2;
        r3v.innerHTML = r3;
    }



    if (discriminant < 0) {
        const theta: number = (1 / 3) * Math.acos(-q / (2 * Math.sqrt(-((p / 3) ** 3))));
        root1 = 2 * Math.sqrt(-p / 3) * Math.cos(theta) - (b / (3 * a));
        root2 = 2 * Math.sqrt(-p / 3) * Math.cos(theta + ((2 * Math.PI) / 3)) - (b / (3 * a));
        root3 = 2 * Math.sqrt(-p / 3) * Math.cos(theta + ((4 * Math.PI) / 3)) - (b / (3 * a));
        rootsDom(root1.toFixed(3), root2.toFixed(3), root3.toFixed(3));
    } else if (discriminant === 0) {
        if (p === 0 && q === 0) {
            root1 = root2 = root3 = cardanoMethod(p, q);
            rootsDom(root1.toFixed(3), root2.toFixed(3), root3.toFixed(3));
        } else {
            root1 = root2 = cardanoMethod(p, q);
            root3 = Math.cbrt(q / 2) - (b / (3 * a));
            rootsDom(root1.toFixed(3), root2.toFixed(3), root3.toFixed(3));
        }
    } else if (discriminant > 0) {
        root1 = cardanoMethod(p, q);
        rootsDom(root1.toFixed(3), "Complex Root", "Complex");
    } else {
        alert("Calculation failed, please try again.")
    }
    pv.innerHTML = p.toFixed(3);
    qv.innerHTML = q.toFixed(3);
    dv.innerHTML = discriminant.toFixed(3);
    result.style.display = "flex";
    canvaLoad(30,a,b,c,d);
})
