const fmtVnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const CART_KEY = "lacskin_cart_v1";
const ORDERS_KEY = "lacskin_orders_v1";

const els = {
  grid: document.querySelector("#productGrid"),
  searchInput: document.querySelector("#searchInput"),
  categorySelect: document.querySelector("#categorySelect"),
  sortSelect: document.querySelector("#sortSelect"),
  tagFilters: document.querySelector("#tagFilters"),
  chatbot: document.querySelector(".chatbot"),
  chatLog: document.querySelector("#chatLog"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  chatMinimizeBtn: document.querySelector("#chatMinimizeBtn"),
  openChatBtn: document.querySelector("#openChatBtn"),
  heroProductImg: document.querySelector("#heroProductImg"),
  ingredientList: document.querySelector("#ingredientList"),
  ingredientHeroImg: document.querySelector("#ingredientHeroImg"),
  popularGrid: document.querySelector("#popularGrid"),
  discountHeroImg: document.querySelector("#discountHeroImg"),
  newsletterForm: document.querySelector("#newsletterForm"),
  newsletterEmail: document.querySelector("#newsletterEmail"),
  newsletterMsg: document.querySelector("#newsletterMsg"),
  modalBackdrop: document.querySelector("#productModal"),
  modalBody: document.querySelector("#modalBody"),
  modalClose: document.querySelector("#modalClose"),
  cartToggleBtn: document.querySelector("#cartToggleBtn"),
  cartBadge: document.querySelector("#cartBadge"),
  cartDrawer: document.querySelector("#cartDrawer"),
  cartDrawerClose: document.querySelector("#cartDrawerClose"),
  cartLines: document.querySelector("#cartLines"),
  cartEmpty: document.querySelector("#cartEmpty"),
  cartFooter: document.querySelector("#cartFooter"),
  cartSubtotal: document.querySelector("#cartSubtotal"),
  checkoutBtn: document.querySelector("#checkoutBtn"),
  cartView: document.querySelector("#cartView"),
  checkoutView: document.querySelector("#checkoutView"),
  checkoutBackBtn: document.querySelector("#checkoutBackBtn"),
  checkoutForm: document.querySelector("#checkoutForm"),
  orderSuccessView: document.querySelector("#orderSuccessView"),
  orderSuccessDone: document.querySelector("#orderSuccessDone"),
  orderIdDisplay: document.querySelector("#orderIdDisplay"),
  coSubtotal: document.querySelector("#coSubtotal"),
  coDiscount: document.querySelector("#coDiscount"),
  coDiscountRow: document.querySelector("#coDiscountRow"),
  coTotal: document.querySelector("#coTotal")
};

let products = [];
let activeTag = "all";
/** @type {Array<{ lineId: string, slug: string, name: string, brand: string, image: string, volume_ml: number|null, price_vnd: number, qty: number }>} */
let cart = [];
const DATA_SOURCES = [
  "./images/nước tẩy trang/products_data.json",
  "./images/sữa rửa mặt/product_data.json"
];
const IMAGE_MAP = {
  "sensibio-h2o": [
    "images/nước tẩy trang/1. Nước Tẩy Trang Bioderma Sensibio H2O (Da Nhạy Cảm).jpg",
    "images/nước tẩy trang/1. Nước Tẩy Trang Bioderma Sensibio H2O (Da Nhạy Cảm) 2.jpg"
  ],
  "sebium-h2o": [
    "images/nước tẩy trang/2. Bioderma Sébium H2O (Da Dầu & Hỗn Hợp).jpg",
    "images/nước tẩy trang/2. Bioderma Sébium H2O (Da Dầu & Hỗn Hợp) 2.jpg"
  ],
  "hydrabio-h2o": [
    "images/nước tẩy trang/3. Bioderma Hydrabio H2O (Da Khô & Thiếu Nước).jpg",
    "images/nước tẩy trang/3. Bioderma Hydrabio H2O (Da Khô & Thiếu Nước) 2.png"
  ],
  "pigmentbio-h2o": [
    "images/nước tẩy trang/4. Bioderma Pigmentbio H2O (Da Thâm, Xỉn Màu).png",
    "images/nước tẩy trang/4. Bioderma Pigmentbio H2O (Da Thâm, Xỉn Màu) 2.jpg"
  ],
  "abcdem-h2o": ["images/nước tẩy trang/5. Bioderma ABCDerm H2O (Cho Trẻ Em).png"],
  "sensibio-eye": ["images/nước tẩy trang/6. Bioderma Sensibio H2O Eye (Tẩy Trang Mắt Môi).jpg"],
  "green-tea-cleansing-oil": [
    "images/nước tẩy trang/1. Innisfree Green Tea Amino Hydrating Cleansing Oil.png",
    "images/nước tẩy trang/1. Innisfree Green Tea Amino Hydrating Cleansing Oil 2.jpg",
    "images/nước tẩy trang/1. Innisfree Green Tea Amino Hydrating Cleansing Oil 3.jpg"
  ],
  "apple-seed-cleansing-oil": ["images/nước tẩy trang/4. Innisfree Apple Seed Lip & Eye Remover.png"],
  "green-tea-cleansing-water": ["images/nước tẩy trang/3. Innisfree Green Tea Cleansing Water.jpg"],
  "apple-lip-eye-remover": ["images/nước tẩy trang/4. Innisfree Apple Seed Lip & Eye Remover.png"],
  "olive-cleansing-oil": ["images/nước tẩy trang/Innisfree Olive Real Cleansing Oil.jpg"],
  "micellar-refreshing": [
    "images/nước tẩy trang/1. L’Oréal Micellar Water 3-in-1 Refreshing (Xanh dương).jpg",
    "images/nước tẩy trang/1. L’Oréal Micellar Water 3-in-1 Refreshing (Xanh dương) 2.jpg"
  ],
  "micellar-moisturizing": [
    "images/nước tẩy trang/L’Oréal Micellar Water Moisturizing (Hồng).jpg",
    "images/nước tẩy trang/L’Oréal Micellar Water Moisturizing (Hồng) 2.jpg"
  ],
  "micellar-deep": [
    "images/nước tẩy trang/3. L’Oréal Micellar Water Deep Cleansing (Xanh đậm).jpg",
    "images/nước tẩy trang/3. L’Oréal Micellar Water Deep Cleansing (Xanh đậm) 2.jpg"
  ],
  "loreal-eye-remover": ["images/nước tẩy trang/4. L’Oréal Gentle Lip & Eye Makeup Remover.jpg"],
  "winter-melon-micellar": [
    "images/nước tẩy trang/1. Nước tẩy trang bí đao Cocoon (Winter Melon Micellar Water).jpg",
    "images/nước tẩy trang/1. Nước tẩy trang bí đao Cocoon (Winter Melon Micellar Water) 2.jpg"
  ],
  "rose-micellar": [
    "images/nước tẩy trang/2. Nước tẩy trang hoa hồng Cocoon (Rose Micellar Water).jpg",
    "images/nước tẩy trang/2. Nước tẩy trang hoa hồng Cocoon (Rose Micellar Water) 2.png"
  ],
  "lotus-micellar": [
    "images/nước tẩy trang/3. Nước tẩy trang sen Hậu Giang Cocoon.jpg",
    "images/nước tẩy trang/3. Nước tẩy trang sen Hậu Giang Cocoon 2.png"
  ],
  "sebium-gel-moussant-actif": ["images/sữa rửa mặt/Sữa rửa mặt Bioderma Sébium Gel moussant actif loại bỏ tế bào chết và giảm mụn hiệu quả.jpg"],
  "cerave-foaming-cleanser": ["images/sữa rửa mặt/6. Sữa rửa mặt Cerave Developed With Dermatologists Foaming Cleanser.png"],
  "cetaphil-gentle-cleanser": ["images/sữa rửa mặt/7. Sữa rửa mặt lành tính Cetaphil Gentle Skin Cleanser.png"],
  "green-tea-foam": [
    "images/sữa rửa mặt/INNISFREE GREEN TEA FOAM CLEANSER.png",
    "images/sữa rửa mặt/INNISFREE GREEN TEA FOAM CLEANSER (2).png",
    "images/sữa rửa mặt/INNISFREE GREEN TEA FOAM CLEANSER (3).png"
  ],
  "volcanic-foam": [
    "images/sữa rửa mặt/INNISFREE VOLCANIC PORE CLEANSING FOAM.png",
    "images/sữa rửa mặt/INNISFREE VOLCANIC PORE CLEANSING FOAM (2).png",
    "images/sữa rửa mặt/INNISFREE VOLCANIC PORE CLEANSING FOAM (3).png"
  ],
  "glycolic-cleanser": [
    "images/sữa rửa mặt/L'Oréal Paris Glycolic Bright Glowing Daily Cleanser Foam.png",
    "images/sữa rửa mặt/L'Oréal Paris Glycolic Bright Glowing Daily Cleanser Foam (2).png",
    "images/sữa rửa mặt/L'Oréal Paris 3.5% Glycolic Acid Cleanser.png"
  ],
  "winter-melon-cleanser": [
    "images/sữa rửa mặt/Gel Rửa Mặt Chiết Xuất Bí Đao Cocoon Winter Melon Cleanser.png",
    "images/sữa rửa mặt/Gel Rửa Mặt Chiết Xuất Bí Đao Cocoon Winter Melon Cleanser (2).png",
    "images/sữa rửa mặt/Gel Rửa Mặt Chiết Xuất Bí Đao Cocoon Winter Melon Cleanser (3).png"
  ],
  "atoderm-intensive-gel": ["images/sữa rửa mặt/Gel sữa rửa mặt bioderma Atoderm Intensive gel moussant.png"],
  "sensibio-gel": ["images/sữa rửa mặt/3. Sữa rửa mặt Bioderma Sensibio Gel moussant tạo bọt dịu nhẹ.png"],
  "sebium-gel": ["images/sữa rửa mặt/4. sữa rửa mặt Bioderma Sebium Gel Moussant tạo bọt, không chứa xà phòng.png"],
  "svr-sebiaclear": ["images/sữa rửa mặt/5. Sữa rửa mặt SVR Sebiaclear Gel Moussant.png"],
  "berry-foam": [
    "images/sữa rửa mặt/INNISFREE BERRY MIX SMOOTHING FOAM.png",
    "images/sữa rửa mặt/INNISFREE BERRY MIX SMOOTHING FOAM (2).png",
    "images/sữa rửa mặt/INNISFREE BERRY MIX SMOOTHING FOAM (3).png"
  ],
  "jeju-mild": [
    "images/sữa rửa mặt/INNISFREE JEJU MILD FOAM CLEANSER.png",
    "images/sữa rửa mặt/INNISFREE JEJU MILD FOAM CLEANSER (2).png",
    "images/sữa rửa mặt/INNISFREE JEJU MILD FOAM CLEANSER (3).png"
  ],
  "revitalift-foam": [
    "images/sữa rửa mặt/L'Oréal Revitalift Gel Cleanser.png",
    "images/sữa rửa mặt/L'Oréal Revitalift Milk Foam Cleanser.png",
    "images/sữa rửa mặt/L'Oréal Revitalift Milk Foam Cleanser (2).png"
  ],
  "turmeric-cleanser": [
    "images/sữa rửa mặt/Cocoon Sữa Rửa Mặt Nghệ Hưng Yên Turmeric Cleanser.png",
    "images/sữa rửa mặt/Cocoon Sữa Rửa Mặt Nghệ Hưng Yên Turmeric Cleanser (2).png",
    "images/sữa rửa mặt/Cocoon Sữa Rửa Mặt Nghệ Hưng Yên Turmeric Cleanser (3).png"
  ],
  "coffee-cleanser": [
    "images/sữa rửa mặt/Gel Rửa Mặt Cà Phê Đắk Lắk Cocoon 140ml.png",
    "images/sữa rửa mặt/Gel Rửa Mặt Cà Phê Đắk Lắk Cocoon 140ml (2).png",
    "images/sữa rửa mặt/Gel Rửa Mặt Cà Phê Đắk Lắk Cocoon 140ml (3).png"
  ],
  "lotus-cleanser": [
    "images/sữa rửa mặt/Sữa Rửa Mặt Sen Hậu Giang Cocoon Lotus Soothing Cleanser.png",
    "images/sữa rửa mặt/Sữa Rửa Mặt Sen Hậu Giang Cocoon Lotus Soothing Cleanser (2).png",
    "images/sữa rửa mặt/Sữa Rửa Mặt Sen Hậu Giang Cocoon Lotus Soothing Cleanser (3).png"
  ]
};
const displayMap = {
  "tay-trang": "Tẩy trang",
  "sua-rua-mat": "Sữa rửa mặt",
  "mat-moi": "Mắt môi",
  "dau-tay-trang": "Dầu tẩy trang",
  "da-nhay-cam": "Da nhạy cảm",
  "khong-con": "Không cồn",
  "hang-ngay": "Hằng ngày",
  "diu-nhe": "Dịu nhẹ",
  "da-dau": "Da dầu",
  "da-mun": "Da mụn",
  "kiem-soat-dau": "Kiểm soát dầu",
  "lo-chan-long": "Lỗ chân lông",
  "da-kho": "Da khô",
  "cap-am": "Cấp ẩm",
  "thieu-nuoc": "Thiếu nước",
  "da-xin-mau": "Da xỉn màu",
  "ho-tro-sang-da": "Hỗ trợ sáng da",
  "tre-em": "Trẻ em",
  "sieu-diu-nhe": "Siêu dịu nhẹ",
  "da-sieu-nhay-cam": "Da siêu nhạy cảm",
  "khong-cay-mat": "Không cay mắt",
  "tra-xanh": "Trà xanh",
  "duong-am": "Dưỡng ẩm",
  "hat-tao": "Hạt táo",
  "tay-trang-nuoc": "Tẩy trang nước",
  "cap-am-nhe": "Cấp ẩm nhẹ",
  "lip-remover": "Tẩy trang môi",
  "da-hon-hop": "Da hỗn hợp",
  "pho-thong": "Phổ thông",
  "de-dung": "Dễ dùng",
  "lam-sach-sau": "Làm sạch sâu",
  "kiem-soat-bong-dau": "Kiểm soát bóng dầu",
  "makeup-dam": "Makeup đậm",
  "bi-dao": "Bí đao",
  "thuong-hieu-viet": "Thương hiệu Việt",
  "hoa-hong": "Hoa hồng",
  "phuc-hoi": "Phục hồi",
  "sen": "Sen"
};

const displayLabel = (value) => displayMap[value] || value.replaceAll("-", " ");

function getMinPrice(product) {
  if (product?.price_options?.length) {
    return Math.min(...product.price_options.map((o) => o.price_vnd ?? o.price ?? 0));
  }
  return product?.price?.min ?? 0;
}

function getDisplayPrice(product) {
  return fmtVnd.format(getMinPrice(product));
}

function formatVolume(volumeMl) {
  if (!volumeMl) return "";
  return `${volumeMl}ml`;
}

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartLineId(slug, volumeMl) {
  return `${slug}::${volumeMl ?? "base"}`;
}

function getCartCount() {
  return cart.reduce((s, l) => s + l.qty, 0);
}

function getCartSubtotal() {
  return cart.reduce((s, l) => s + l.price_vnd * l.qty, 0);
}

function updateCartBadge() {
  const n = getCartCount();
  els.cartBadge.hidden = n === 0;
  els.cartBadge.textContent = String(n > 99 ? "99+" : n);
}

function parseVariantValue(val) {
  const [vol, price] = String(val).split("|");
  const parsedVol = vol ? Number.parseInt(vol, 10) : NaN;
  const volume_ml = Number.isFinite(parsedVol) ? parsedVol : null;
  const price_vnd = Number.parseInt(price, 10) || 0;
  return { volume_ml, price_vnd };
}

function addToCart(product, variantValue, qty) {
  const { volume_ml, price_vnd } = parseVariantValue(variantValue);
  const unit = price_vnd > 0 ? price_vnd : getMinPrice(product);
  const lineId = cartLineId(product.slug, volume_ml);
  const existing = cart.find((l) => l.lineId === lineId);
  const q = Math.max(1, Math.min(99, qty));
  if (existing) {
    existing.qty = Math.min(99, existing.qty + q);
  } else {
    cart.push({
      lineId,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.image || "",
      volume_ml,
      price_vnd: unit,
      qty: q
    });
  }
  saveCart();
}

function setLineQty(lineId, qty) {
  const line = cart.find((l) => l.lineId === lineId);
  if (!line) return;
  if (qty <= 0) {
    cart = cart.filter((l) => l.lineId !== lineId);
  } else {
    line.qty = Math.min(99, qty);
  }
  saveCart();
  renderCartDrawer();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCartDrawer();
}

function showCartPanels(mode) {
  const isCart = mode === "cart";
  const isCheckout = mode === "checkout";
  const isSuccess = mode === "success";
  els.cartView.hidden = !isCart;
  els.cartFooter.hidden = !isCart || cart.length === 0;
  els.checkoutView.hidden = !isCheckout;
  els.orderSuccessView.hidden = !isSuccess;
  document.getElementById("cartDrawerTitle").textContent =
    isCheckout ? "Thanh toán" : isSuccess ? "Hoàn tất" : "Giỏ hàng";
}

function renderCartDrawer() {
  if (!els.cartLines) return;
  const empty = cart.length === 0;
  els.cartEmpty.hidden = !empty;
  els.cartFooter.hidden = empty;
  els.cartSubtotal.textContent = fmtVnd.format(getCartSubtotal());

  if (empty) {
    els.cartLines.innerHTML = "";
    return;
  }

  els.cartLines.innerHTML = cart
    .map((line) => {
      const volLabel = line.volume_ml ? `${line.volume_ml}ml` : "Mặc định";
      const lineTotal = line.price_vnd * line.qty;
      const img = line.image
        ? `<img src="${line.image}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" />`
        : `<div class="thumb" style="width:72px;height:72px;border-radius:10px"></div>`;
      return `
      <div class="cart-line" data-line-id="${line.lineId}">
        ${img}
        <div class="cart-line-info">
          <h4>${line.name}</h4>
          <div class="cart-line-meta">${line.brand} • ${volLabel}</div>
          <div class="cart-line-meta">${fmtVnd.format(line.price_vnd)} / sản phẩm</div>
        </div>
        <div class="cart-line-actions">
          <div class="cart-line-price">${fmtVnd.format(lineTotal)}</div>
          <div class="cart-qty">
            <button type="button" data-qty="-1" aria-label="Giảm">−</button>
            <span>${line.qty}</span>
            <button type="button" data-qty="1" aria-label="Tăng">+</button>
          </div>
          <button type="button" class="cart-line-remove" data-remove="1">Xóa</button>
        </div>
      </div>`;
    })
    .join("");
}

function openCartDrawer(view = "cart") {
  els.cartDrawer.hidden = false;
  document.body.style.overflow = "hidden";
  if (view === "checkout") {
    showCartPanels("checkout");
    updateCheckoutTotals();
  } else {
    showCartPanels("cart");
    renderCartDrawer();
  }
}

function closeCartDrawer() {
  els.cartDrawer.hidden = true;
  showCartPanels("cart");
  if (els.modalBackdrop.hidden) {
    document.body.style.overflow = "";
  }
}

function updateCheckoutTotals() {
  if (!els.checkoutForm || !els.coSubtotal || !els.coTotal) return;
  const subtotal = getCartSubtotal();
  const promoInput = els.checkoutForm.querySelector('[name="promo"]');
  const code = (promoInput?.value || "").trim().toUpperCase();
  let discount = 0;
  if (code === "LAC10" && subtotal >= 499000) {
    discount = Math.round(subtotal * 0.1);
  }
  const total = Math.max(0, subtotal - discount);
  els.coSubtotal.textContent = fmtVnd.format(subtotal);
  if (discount > 0) {
    els.coDiscountRow.hidden = false;
    els.coDiscount.textContent = `−${fmtVnd.format(discount)}`;
  } else {
    els.coDiscountRow.hidden = true;
  }
  els.coTotal.textContent = fmtVnd.format(total);
}

function openModal() {
  els.modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  els.modalBackdrop.hidden = true;
  els.modalBody.innerHTML = "";
  if (!els.cartDrawer.hidden) return;
  document.body.style.overflow = "";
}

function renderProductDetail(p, activeImageIndex = 0) {
  const imgs = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  const safeIdx = Math.max(0, Math.min(activeImageIndex, Math.max(0, imgs.length - 1)));
  const mainImg = imgs[safeIdx] || p.image || "";

  const sortedOptions = (p.price_options || [])
    .slice()
    .sort((a, b) => (a.volume_ml ?? 0) - (b.volume_ml ?? 0))
    .filter((o) => o.price_vnd || o.price);

  const variantSelectHtml =
    sortedOptions.length > 0
      ? sortedOptions
          .map((o) => {
            const vol = o.volume_ml ?? "";
            const pr = o.price_vnd ?? o.price ?? 0;
            const lab = o.volume_ml ? formatVolume(o.volume_ml) : "Mặc định";
            return `<option value="${vol}|${pr}">${lab} — ${fmtVnd.format(pr)}</option>`;
          })
          .join("")
      : `<option value="|${getMinPrice(p)}">Mặc định — ${getDisplayPrice(p)}</option>`;

  const priceTable =
    sortedOptions.length > 0
      ? `<table class="pdp-table">
        ${sortedOptions
          .map((o) => `<tr><td>${formatVolume(o.volume_ml)}</td><td style="text-align:right;font-weight:700">${fmtVnd.format(o.price_vnd ?? o.price ?? 0)}</td></tr>`)
          .join("")}
      </table>`
      : `<div class="meta">Chưa có bảng giá theo dung tích.</div>`;

  const listBox = (title, items) => {
    const arr = (items || []).filter(Boolean);
    if (!arr.length) return "";
    return `<div class="pdp-box"><h4>${title}</h4><ul class="pdp-list">${arr.map((x) => `<li>${x}</li>`).join("")}</ul></div>`;
  };

  const chips = (items) => {
    const arr = (items || []).filter(Boolean).slice(0, 12);
    if (!arr.length) return "";
    return `<div class="chips">${arr.map((x) => `<span class="chip">${displayLabel(slugify(x))}</span>`).join("")}</div>`;
  };

  els.modalBody.innerHTML = `
    <div class="pdp" data-slug="${p.slug}">
      <div>
        <div class="pdp-main">
          ${mainImg ? `<img src="${mainImg}" alt="${p.name}" loading="lazy" />` : `<div class="thumb"></div>`}
        </div>
        ${
          imgs.length > 1
            ? `<div class="pdp-thumbs">
                ${imgs
                  .slice(0, 10)
                  .map(
                    (src, i) => `<button class="pdp-thumb ${i === safeIdx ? "active" : ""}" type="button" data-img-index="${i}">
                      <img src="${src}" alt="${p.name} ${i + 1}" loading="lazy" />
                    </button>`
                  )
                  .join("")}
              </div>`
            : ``
        }
      </div>
      <div>
        <h3 id="modalTitle" class="pdp-title">${p.name}</h3>
        <div class="pdp-sub">${p.brand} • ${displayLabel(p.category)} ${p.type ? `• ${p.type}` : ""}</div>
        <p class="pdp-price">Giá từ ${getDisplayPrice(p)}</p>
        <div class="pdp-buy">
          <div class="pdp-buy-row">
            <div>
              <label for="pdpVariantSelect">Chọn dung tích</label>
              <select id="pdpVariantSelect">${variantSelectHtml}</select>
            </div>
            <div>
              <label for="pdpQty">Số lượng</label>
              <input id="pdpQty" type="number" min="1" max="99" value="1" />
            </div>
          </div>
          <div class="pdp-actions">
            <button class="btn" type="button" data-action="addToCart">Thêm vào giỏ</button>
            <button class="btn-outline" type="button" data-action="buyNow">Mua ngay</button>
          </div>
        </div>
        <div class="pdp-actions">
          <button class="btn-outline" type="button" data-action="copyLink">Copy link</button>
          <button class="btn-outline" type="button" data-action="chatSuggest">Hỏi chatbot</button>
        </div>

        ${p.description ? `<div class="pdp-box"><h4>Mô tả</h4><div class="meta">${p.description}</div></div>` : ""}

        ${chips([...(p.tags || [])].map((t) => t))}

        <div class="pdp-grid">
          ${listBox("Phù hợp da", p.skin_type)}
          ${listBox("Công dụng", p.effects)}
          ${listBox("Thành phần nổi bật", p.ingredients)}
          <div class="pdp-box"><h4>Giá theo dung tích</h4>${priceTable}</div>
        </div>
      </div>
    </div>
  `;
}

function openProductBySlug(slug) {
  const target = products.find((p) => p.slug === slug);
  if (!target) return;
  renderProductDetail(target, 0);
  openModal();
  history.replaceState(null, "", `#${target.slug}`);
}

function parseConcatenatedArrays(text) {
  const arrays = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "[") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === "]") {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        const chunk = text.slice(start, i + 1).trim();
        if (chunk.startsWith("[")) arrays.push(JSON.parse(chunk));
        start = -1;
      }
    }
  }
  return arrays.flat();
}

function normalizePriceOptions(priceOptions = []) {
  return priceOptions.map((o) => {
    const volume = Number.parseInt((o.size || "").replace(/\D/g, ""), 10);
    return {
      volume_ml: Number.isFinite(volume) ? volume : o.volume_ml ?? null,
      price_vnd: o.price_vnd ?? o.price ?? 0
    };
  });
}

function normalizeCategory(category = "") {
  const normalized = slugify(category);
  if (normalized === "sua-rua-mat") return "sua-rua-mat";
  if (normalized.includes("tay-trang")) return "tay-trang";
  return normalized || "khac";
}

function normalizeProduct(raw, idx) {
  const display = raw.display || {};
  const core = raw.core || {};
  const slug = raw.slug || slugify(`${raw.brand || ""}-${raw.name || display.title || `item-${idx + 1}`}`);
  const name = raw.name || display.title || slug;
  const images = IMAGE_MAP[slug] || raw.images || (raw.image ? [raw.image] : []);
  const tags =
    raw.tags ||
    [...(core.skin_type || raw.skin_type || []), ...(core.effects || raw.effects || [])]
      .slice(0, 6)
      .map((v) => slugify(v))
      .filter(Boolean);

  return {
    id: raw.id || slug || `tmp-${idx + 1}`,
    slug,
    brand: raw.brand || "Unknown",
    name,
    category: normalizeCategory(raw.category || raw.type),
    type: raw.type || "",
    skin_type: raw.skin_type || core.skin_type || [],
    tags,
    description: raw.description || display.short_description || "",
    ingredients: raw.ingredients || core.ingredients || [],
    effects: raw.effects || core.effects || [],
    use_case: raw.use_case || [],
    price_options: normalizePriceOptions(raw.price_options || []),
    images,
    image: images[0] || ""
  };
}

function dedupeProducts(list) {
  const seen = new Map();
  list.forEach((p) => {
    const key = p.id || p.slug;
    if (!seen.has(key)) seen.set(key, p);
  });
  return [...seen.values()];
}

function buildFilters(data) {
  const categories = [...new Set(data.map((p) => p.category))].sort();
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = displayLabel(cat);
    els.categorySelect.append(option);
  });

  const tags = [...new Set(data.flatMap((p) => p.tags))].sort();
  els.tagFilters.innerHTML = `<button class="tag active" data-tag="all">Tất cả thẻ</button>`;
  tags.forEach((tag) => {
    const b = document.createElement("button");
    b.className = "tag";
    b.dataset.tag = tag;
    b.textContent = displayLabel(tag);
    els.tagFilters.append(b);
  });
}

function renderCards(data) {
  if (!data.length) {
    els.grid.innerHTML = `<p>Không tìm thấy sản phẩm phù hợp.</p>`;
    return;
  }

  els.grid.innerHTML = data
    .map(
      (p) => `
      <article class="card product-card" role="button" tabindex="0" data-slug="${p.slug}">
        <img class="thumb" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'thumb\\'></div>')" />
        <div class="card-body">
          <div class="meta">${p.brand} • ${displayLabel(p.category)}</div>
          <h3>${p.name}</h3>
          <p class="meta">${p.description || ""}</p>
          <p class="price">Từ ${getDisplayPrice(p)}</p>
        </div>
      </article>
    `
    )
    .join("");
}

function pickIngredients(product) {
  const list = Array.isArray(product?.ingredients) && product.ingredients.length ? product.ingredients : Array.isArray(product?.effects) ? product.effects : [];
  return list.filter(Boolean).slice(0, 10);
}

function renderHomePage() {
  const featured = products[0];
  const secondary = products[1] || products[0];
  if (els.heroProductImg && featured?.image) els.heroProductImg.src = featured.image;
  if (els.ingredientHeroImg && secondary?.image) els.ingredientHeroImg.src = secondary.image;
  if (els.discountHeroImg && secondary?.image) els.discountHeroImg.src = secondary.image;

  if (els.ingredientList) {
    const ing = pickIngredients(featured || secondary);
    els.ingredientList.innerHTML = ing.map((x) => `<li class="ingredient-item">${x}</li>`).join("");
  }

  if (els.popularGrid) {
    const popular = products
      .slice()
      .sort((a, b) => getMinPrice(a) - getMinPrice(b))
      .slice(0, 8);

    els.popularGrid.innerHTML = popular
      .map(
        (p) => `
        <article class="popular-card" data-slug="${p.slug}">
          <div class="popular-media">
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" />
          </div>
          <div class="popular-body">
            <div class="popular-meta">${p.brand} • ${displayLabel(p.category)}</div>
            <h3 class="popular-title">${p.name}</h3>
            <div class="popular-price">Từ ${getDisplayPrice(p)}</div>
            <button class="popular-cta btn-outline" type="button">Xem chi tiết</button>
          </div>
        </article>`
      )
      .join("");
  }
}

function getFilteredProducts() {
  const q = slugify(els.searchInput.value.trim());
  const cat = els.categorySelect.value;
  const sort = els.sortSelect.value;

  let result = products.filter((p) => {
    const haystack = slugify(`${p.brand} ${p.name} ${p.description} ${p.tags.join(" ")} ${p.skin_type?.join(" ") || ""}`);
    const okSearch = !q || haystack.includes(q);
    const okCat = cat === "all" || p.category === cat;
    const okTag = activeTag === "all" || p.tags.includes(activeTag);
    return okSearch && okCat && okTag;
  });

  if (sort === "priceAsc") {
    result = result.sort((a, b) => getMinPrice(a) - getMinPrice(b));
  } else if (sort === "priceDesc") {
    result = result.sort((a, b) => getMinPrice(b) - getMinPrice(a));
  }
  return result;
}

function renderFiltered() {
  renderCards(getFilteredProducts());
}

function pushChatMessage(type, text) {
  const div = document.createElement("div");
  div.className = type === "user" ? "user-msg" : "bot-msg";
  div.textContent = text;
  els.chatLog.append(div);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function setChatMinimized(minimized) {
  els.chatbot.classList.toggle("minimized", minimized);
  els.chatMinimizeBtn.textContent = minimized ? "+" : "−";
  els.chatMinimizeBtn.setAttribute("aria-expanded", minimized ? "false" : "true");
}

function chatbotSuggest(query) {
  const normalized = slugify(query);
  const scored = products
    .map((p) => {
      const pool = slugify(`${p.use_case} ${p.tags.join(" ")} ${p.skin_type?.join(" ") || ""} ${p.effects?.join(" ") || ""}`);
      let score = 0;
      normalized.split("-").forEach((token) => {
        if (token && pool.includes(token)) score += 1;
      });
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!scored.length) {
    return "Mình chưa thấy sản phẩm khớp rõ ràng. Bạn thử mô tả kỹ hơn: loại da, vấn đề da, mức giá mong muốn.";
  }

  const lines = scored.map(({ p }) => `- ${p.name} (${p.brand})`);
  return `Gợi ý cho bạn:\n${lines.join("\n")}`;
}

function bindEvents() {
  [els.searchInput, els.categorySelect, els.sortSelect].forEach((el) => {
    el.addEventListener("input", renderFiltered);
    el.addEventListener("change", renderFiltered);
  });

  if (els.openChatBtn) {
    els.openChatBtn.addEventListener("click", () => {
      if (!els.chatbot) return;
      setChatMinimized(false);
      els.chatInput.focus();
      els.chatInput.value = "";
      if (els.chatLog) {
        // keep existing history
      }
      els.chatbot.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }

  els.grid.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;
    const slug = card.dataset.slug;
    if (slug) openProductBySlug(slug);
  });

  els.popularGrid?.addEventListener("click", (e) => {
    const card = e.target.closest(".popular-card");
    if (!card) return;
    const slug = card.dataset.slug;
    if (slug) openProductBySlug(slug);
  });

  els.grid.addEventListener("keydown", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const slug = card.dataset.slug;
      if (slug) openProductBySlug(slug);
    }
  });

  els.modalBackdrop.addEventListener("click", (e) => {
    if (e.target === els.modalBackdrop) {
      closeModal();
      history.replaceState(null, "", "#san-pham");
    }
  });

  els.modalClose.addEventListener("click", () => {
    closeModal();
    history.replaceState(null, "", "#san-pham");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!els.cartDrawer.hidden) {
      if (!els.checkoutView.hidden && els.orderSuccessView.hidden) {
        showCartPanels("cart");
        renderCartDrawer();
        return;
      }
      closeCartDrawer();
      return;
    }
    if (!els.modalBackdrop.hidden) {
      closeModal();
      history.replaceState(null, "", "#san-pham");
    }
  });

  els.modalBody.addEventListener("click", async (e) => {
    const thumb = e.target.closest(".pdp-thumb");
    if (thumb) {
      const idx = Number.parseInt(thumb.dataset.imgIndex || "0", 10);
      const slug = els.modalBody.querySelector(".pdp")?.dataset?.slug;
      const p = products.find((x) => x.slug === slug);
      if (p) renderProductDetail(p, Number.isFinite(idx) ? idx : 0);
      return;
    }

    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const slug = els.modalBody.querySelector(".pdp")?.dataset?.slug;
    const p = products.find((x) => x.slug === slug);
    if (!p) return;

    if (action === "copyLink") {
      const url = `${location.origin}${location.pathname}#${p.slug}`;
      try {
        await navigator.clipboard.writeText(url);
        btn.textContent = "Đã copy";
        setTimeout(() => (btn.textContent = "Copy link"), 1200);
      } catch {
        btn.textContent = "Không copy được";
        setTimeout(() => (btn.textContent = "Copy link"), 1200);
      }
    }

    if (action === "chatSuggest") {
      const prompt = `Tư vấn nhanh: ${p.name} phù hợp da nào? Khi nào nên dùng?`;
      els.chatInput.value = prompt;
      els.chatInput.focus();
    }

    if (action === "addToCart" || action === "buyNow") {
      const sel = document.getElementById("pdpVariantSelect");
      const qtyEl = document.getElementById("pdpQty");
      if (!sel || !qtyEl) return;
      const qty = Math.max(1, Math.min(99, Number.parseInt(qtyEl.value, 10) || 1));
      addToCart(p, sel.value, qty);
      renderCartDrawer();
      if (action === "addToCart") {
        const prev = btn.textContent;
        btn.textContent = "Đã thêm ✓";
        setTimeout(() => {
          btn.textContent = prev;
        }, 1200);
      } else {
        closeModal();
        history.replaceState(null, "", "#san-pham");
        openCartDrawer("checkout");
      }
    }
  });

  els.tagFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag");
    if (!btn) return;
    activeTag = btn.dataset.tag || "all";
    document.querySelectorAll(".tag").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    renderFiltered();
  });

  els.chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = els.chatInput.value.trim();
    if (!value) return;
    pushChatMessage("user", value);
    pushChatMessage("bot", chatbotSuggest(value));
    els.chatInput.value = "";
  });

  els.chatMinimizeBtn.addEventListener("click", () => {
    const isMinimized = els.chatbot.classList.contains("minimized");
    setChatMinimized(!isMinimized);
  });

  els.newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (els.newsletterEmail?.value || "").trim();
    if (!email) return;
    if (els.newsletterMsg) {
      els.newsletterMsg.hidden = false;
      els.newsletterMsg.textContent = `Cảm ơn bạn! Email ${email} đã được đăng ký (demo).`;
    }
    if (els.newsletterEmail) els.newsletterEmail.value = "";
  });

  els.cartToggleBtn.addEventListener("click", () => openCartDrawer("cart"));

  els.cartDrawerClose.addEventListener("click", () => closeCartDrawer());

  els.cartDrawer.addEventListener("click", (e) => {
    if (e.target === els.cartDrawer) closeCartDrawer();
  });

  els.cartLines.addEventListener("click", (e) => {
    const lineEl = e.target.closest(".cart-line");
    if (!lineEl) return;
    const lineId = lineEl.dataset.lineId;
    if (e.target.closest("[data-remove]")) {
      setLineQty(lineId, 0);
      return;
    }
    const dq = e.target.closest("[data-qty]")?.dataset?.qty;
    if (dq == null) return;
    const line = cart.find((l) => l.lineId === lineId);
    if (!line) return;
    setLineQty(lineId, line.qty + Number.parseInt(dq, 10));
  });

  els.checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    showCartPanels("checkout");
    updateCheckoutTotals();
  });

  els.checkoutBackBtn.addEventListener("click", () => {
    showCartPanels("cart");
    renderCartDrawer();
  });

  els.checkoutForm.addEventListener("input", (e) => {
    if (e.target?.name === "promo") updateCheckoutTotals();
  });

  els.checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const fd = new FormData(els.checkoutForm);
    const subtotal = getCartSubtotal();
    const promo = (fd.get("promo") || "").toString().trim().toUpperCase();
    let discount = 0;
    if (promo === "LAC10" && subtotal >= 499000) {
      discount = Math.round(subtotal * 0.1);
    }
    const total = Math.max(0, subtotal - discount);
    const orderId = `LS-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: fd.get("fullName"),
        phone: fd.get("phone"),
        address: fd.get("address"),
        note: fd.get("note") || ""
      },
      payment: fd.get("payment"),
      promoCode: promo || null,
      subtotal,
      discount,
      total,
      items: cart.map((l) => ({ ...l }))
    };
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
    clearCart();
    els.orderIdDisplay.textContent = orderId;
    showCartPanels("success");
  });

  els.orderSuccessDone.addEventListener("click", () => {
    els.checkoutForm?.reset();
    closeCartDrawer();
  });
}

async function init() {
  cart = loadCartFromStorage();
  updateCartBadge();

  const loaded = await Promise.all(
    DATA_SOURCES.map(async (path) => {
      try {
        const res = await fetch(encodeURI(path));
        if (!res.ok) return [];
        const text = await res.text();
        return parseConcatenatedArrays(text);
      } catch {
        return [];
      }
    })
  );
  products = dedupeProducts(loaded.flat().map((item, idx) => normalizeProduct(item, idx))).filter((p) => p.name && p.brand);
  buildFilters(products);
  renderFiltered();
  bindEvents();
  renderHomePage();

  const initialSlug = (location.hash || "").replace(/^#/, "").trim();
  if (initialSlug && initialSlug !== "san-pham" && initialSlug !== "uu-dai" && initialSlug !== "tu-van") {
    openProductBySlug(initialSlug);
  }
}

init();
