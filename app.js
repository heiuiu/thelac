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
  "./images/nuoctaytrang_data.json",
  "./images/suaruamat_data.json",
  "./images/toner_data.json",
  "./images/matna_data.json",
  "./images/kemchongnang_data.json",
  "./images/duongam_data.json"
];

// List all images under /images so we can "guess" matching images per product.
// (Browser can load UTF-8 paths; JS source will contain escaped sequences for safety.)
const IMAGE_FILES = ["images/D\u01b0\u1ee1ng \u1ea9m Bioderma/Bioderma Atoderm Cr\u00e8me Ultra(1).png", "images/D\u01b0\u1ee1ng \u1ea9m Bioderma/Bioderma Atoderm Cr\u00e8me Ultra.png", "images/D\u01b0\u1ee1ng \u1ea9m Bioderma/Bioderma Atoderm Intensive Baume(1).jpg", "images/D\u01b0\u1ee1ng \u1ea9m Bioderma/Bioderma Atoderm Intensive Baume.jpg", "images/D\u01b0\u1ee1ng \u1ea9m Bioderma/Bioderma Hydrabio Gel-Cream.png", "images/D\u01b0\u1ee1ng \u1ea9m Bioderma/Bioderma Sensibio Defensive.png", "images/D\u01b0\u1ee1ng \u1ea9m Bioderma/Bioderma S\u00e9bium Hydra.png", "images/D\u01b0\u1ee1ng \u1ea9m Cocoon/Cocoon Rose Serum (d\u01b0\u1ee1ng \u1ea9m ph\u1ee5c h\u1ed3i).jpg", "images/D\u01b0\u1ee1ng \u1ea9m Cocoon/Cocoon Sen H\u1eadu Giang Multi Balm.png", "images/D\u01b0\u1ee1ng \u1ea9m Cocoon/Th\u1ea1ch B\u00ed \u0110ao Cocoon Winter Melon Gel Cream.png", "images/D\u01b0\u1ee1ng \u1ea9m Cocoon/Th\u1ea1ch Hoa H\u1ed3ng Cocoon Rose Aqua Gel Cream(1).png", "images/D\u01b0\u1ee1ng \u1ea9m Cocoon/Th\u1ea1ch Hoa H\u1ed3ng Cocoon Rose Aqua Gel Cream.png", "images/D\u01b0\u1ee1ng \u1ea9m Cocoon/Th\u1ea1ch Ngh\u1ec7 Cocoon Turmeric Gel Cream.jpg", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Aloe Revital Soothing Gel(1).png", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Aloe Revital Soothing Gel.png", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Bija Cica Balm EX(1).png", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Bija Cica Balm EX.png", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Cherry Blossom Jelly Cream.jpg", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Cherry Blossom Jelly Cream.png", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Green Tea Balancing Cream EX.png", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Green Tea Seed Hyaluronic Cream.jpg", "images/D\u01b0\u1ee1ng \u1ea9m Innisfree/Innisfree Green Tea Seed Hyaluronic Cream.png", "images/D\u01b0\u1ee1ng \u1ea9m L_oreal/L\u2019Or\u00e9al Hydra Genius Aloe Water.png", "images/D\u01b0\u1ee1ng \u1ea9m L_oreal/L\u2019Or\u00e9al Revitalift Hyaluronic Acid Gel Cream (Oil Control).png", "images/D\u01b0\u1ee1ng \u1ea9m L_oreal/L\u2019Or\u00e9al Revitalift Hyaluronic Acid Plumping Cream(1).png", "images/D\u01b0\u1ee1ng \u1ea9m L_oreal/L\u2019Or\u00e9al Revitalift Hyaluronic Acid Plumping Cream.png", "images/D\u01b0\u1ee1ng \u1ea9m L_oreal/L\u2019Or\u00e9al Revitalift Laser X3 Day Cream.png", "images/D\u01b0\u1ee1ng \u1ea9m L_oreal/L\u2019Or\u00e9al Revitalift Triple Power Moisturizer.png", "images/T\u1ea9y trang Bioderma/Bioderma ABCDerm H2O (Cho Tr\u1ebb Em)(1).jpeg", "images/T\u1ea9y trang Bioderma/Bioderma ABCDerm H2O (Cho Tr\u1ebb Em).jpeg", "images/T\u1ea9y trang Bioderma/Bioderma Hydrabio H2O (Da Kh\u00f4 & Thi\u1ebfu N\u1ed9c).jpg", "images/T\u1ea9y trang Bioderma/Bioderma Hydrabio H2O (Da Kh\u00f4 & Thi\u1ebfu N\u1ed9c).png", "images/T\u1ea9y trang Bioderma/Bioderma Pigmentbio H2O (Da Th\u1ea5m, X\u1ec9n M\u1ea4u)(1).jpg", "images/T\u1ea9y trang Bioderma/Bioderma Pigmentbio H2O (Da Th\u1ea5m, X\u1ec9n M\u1ea4u).jpg", "images/T\u1ea9y trang Bioderma/Bioderma Sensibio H2O (Da Nh\u1ea1y C\u1ea3m).jpg", "images/T\u1ea9y trang Bioderma/Bioderma S\u00e9bium H2O (Da D\u1ea7u & H\u1ed7n H\u1ee3p)(1).jpg", "images/T\u1ea9y trang Bioderma/Bioderma S\u00e9bium H2O (Da D\u1ea7u & H\u1ed7n H\u1ee3p).jpg", "images/T\u1ea9y trang Cocoon/b\u00ed \u0111ao Cocoon (Winter Melon Micellar Water).jpg", "images/T\u1ea9y trang Cocoon/b\u00ed \u0111ao Cocoon (Winter Melon Micellar Water).png", "images/T\u1ea9y trang Cocoon/hoa h\u1ed3ng Cocoon (Rose Micellar Water).jpg", "images/T\u1ea9y trang Cocoon/hoa h\u1ed3ng Cocoon (Rose Micellar Water).png", "images/T\u1ea9y trang Cocoon/sen H\u1eadu Giang Cocoon.jpg", "images/T\u1ea9y trang Cocoon/sen H\u1eadu Giang Cocoon.png", "images/T\u1ea9y trang Innisfree/Innisfree Apple Seed Cleansing Oil(1).png", "images/T\u1ea9y trang Innisfree/Innisfree Apple Seed Cleansing Oil.png", "images/T\u1ea9y trang Innisfree/Innisfree Apple Seed Lip & Eye Remover.png", "images/T\u1ea9y trang Innisfree/Innisfree Green Tea Amino Hydrating Cleansing Oil.png", "images/T\u1ea9y trang Innisfree/Innisfree Green Tea Cleansing Water.png", "images/T\u1ea9y trang Innisfree/Innisfree Olive Real Cleansing Oil.png", "images/T\u1ea9y trang L_oreal/L\u2019Or\u00e9al Gentle Lip & Eye Makeup Remover.png", "images/T\u1ea9y trang L_oreal/L\u2019Or\u00e9al Micellar Water 3-in-1 Refreshing (Xanh d\u01b0\u01a1ng)(1).png", "images/T\u1ea9y trang L_oreal/L\u2019Or\u00e9al Micellar Water 3-in-1 Refreshing (Xanh d\u01b0\u01a1ng).png", "images/T\u1ea9y trang L_oreal/L\u2019Or\u00e9al Micellar Water Deep Cleansing (Xanh \u0111\u1eadm)(1).png", "images/T\u1ea9y trang L_oreal/L\u2019Or\u00e9al Micellar Water Deep Cleansing (Xanh \u0111\u1eadm).png", "images/T\u1ea9y trang L_oreal/L\u2019Or\u00e9al Micellar Water Moisturizing (H\u1ed3ng)(1).png", "images/T\u1ea9y trang L_oreal/L\u2019Or\u00e9al Micellar Water Moisturizing (H\u1ed3ng).png", "images/toner/BIODERMA HYDRABIO TONIQUE.PNG", "images/toner/BIODERMA HYDRABIO TONIQUE.jpg", "images/toner/BIODERMA SENSIBIO TONIQUE.PNG", "images/toner/BIODERMA S\u00c9BIUM LOTION.png", "images/toner/COCOON H\u1eacU GIANG LOTUS TONER (2).PNG", "images/toner/COCOON H\u1eacU GIANG LOTUS TONER.PNG", "images/toner/COCOON ROSE TONER (HOA H\u1ed2NG).PNG", "images/toner/INNISFREE BLUEBERRY REBALANCING SKIN.jpeg", "images/toner/INNISFREE BRIGHTENING PORE SKIN.png", "images/toner/INNISFREE GREEN TEA BALANCING SKIN EX.PNG", "images/toner/INNISFREE JEJU VOLCANIC PORE TONER.PNG", "images/toner/INNISFREE TRUECARE PANTHENOL 10 MOISTURE SKIN.png", "images/toner/L\u2019OR\u00c9AL AGE PERFECT TONER.PNG", "images/toner/L\u2019OR\u00c9AL AURA PERFECT TONER (2).PNG", "images/toner/L\u2019OR\u00c9AL AURA PERFECT TONER.PNG", "images/toner/L\u2019OR\u00c9AL HYDRAFRESH ANTI-OX TONER (2).PNG", "images/toner/L\u2019OR\u00c9AL HYDRAFRESH ANTI-OX TONER.PNG", "images/toner/L\u2019OR\u00c9AL REVITALIFT CRYSTAL MICRO-ESSENCE.PNG", "images/toner/L\u2019OR\u00c9AL REVITALIFT HYALURONIC ACID TONER.PNG", "images/toner/quality_restoration_20260326175220187.png"];
const IMAGE_MAP = {
  "sensibio-h2o": ["images/Tẩy trang Bioderma/Bioderma Sensibio H2O (Da Nhạy Cảm).jpg"],
  "sebium-h2o": [
    "images/Tẩy trang Bioderma/Bioderma Sébium H2O (Da Dầu & Hỗn Hợp).jpg",
    "images/Tẩy trang Bioderma/Bioderma Sébium H2O (Da Dầu & Hỗn Hợp)(1).jpg"
  ],
  "hydrabio-h2o": [
    "images/Tẩy trang Bioderma/Bioderma Hydrabio H2O (Da Khô & Thiếu Nước).jpg",
    "images/Tẩy trang Bioderma/Bioderma Hydrabio H2O (Da Khô & Thiếu Nước).png"
  ],
  "pigmentbio-h2o": [
    "images/Tẩy trang Bioderma/Bioderma Pigmentbio H2O (Da Thâm, Xỉn Màu).jpg",
    "images/Tẩy trang Bioderma/Bioderma Pigmentbio H2O (Da Thâm, Xỉn Màu)(1).jpg"
  ],
  "abcdem-h2o": [
    "images/Tẩy trang Bioderma/Bioderma ABCDerm H2O (Cho Trẻ Em).jpeg",
    "images/Tẩy trang Bioderma/Bioderma ABCDerm H2O (Cho Trẻ Em)(1).jpeg"
  ],
  "sensibio-eye": ["images/Tẩy trang Bioderma/Bioderma Sensibio H2O (Da Nhạy Cảm).jpg"],

  "green-tea-cleansing-oil": ["images/Tẩy trang Innisfree/Innisfree Green Tea Amino Hydrating Cleansing Oil.png"],
  "apple-seed-cleansing-oil": [
    "images/Tẩy trang Innisfree/Innisfree Apple Seed Cleansing Oil.png",
    "images/Tẩy trang Innisfree/Innisfree Apple Seed Cleansing Oil(1).png"
  ],
  "green-tea-cleansing-water": ["images/Tẩy trang Innisfree/Innisfree Green Tea Cleansing Water.png"],
  "apple-lip-eye-remover": ["images/Tẩy trang Innisfree/Innisfree Apple Seed Lip & Eye Remover.png"],
  "olive-cleansing-oil": ["images/Tẩy trang Innisfree/Innisfree Olive Real Cleansing Oil.png"],

  "micellar-refreshing": [
    "images/Tẩy trang L_oreal/L’Oréal Micellar Water 3-in-1 Refreshing (Xanh dương).png",
    "images/Tẩy trang L_oreal/L’Oréal Micellar Water 3-in-1 Refreshing (Xanh dương)(1).png"
  ],
  "micellar-moisturizing": [
    "images/Tẩy trang L_oreal/L’Oréal Micellar Water Moisturizing (Hồng).png",
    "images/Tẩy trang L_oreal/L’Oréal Micellar Water Moisturizing (Hồng)(1).png"
  ],
  "micellar-deep": [
    "images/Tẩy trang L_oreal/L’Oréal Micellar Water Deep Cleansing (Xanh đậm).png",
    "images/Tẩy trang L_oreal/L’Oréal Micellar Water Deep Cleansing (Xanh đậm)(1).png"
  ],
  "loreal-eye-remover": ["images/Tẩy trang L_oreal/L’Oréal Gentle Lip & Eye Makeup Remover.png"],

  "winter-melon-micellar": [
    "images/Tẩy trang Cocoon/bí đao Cocoon (Winter Melon Micellar Water).jpg",
    "images/Tẩy trang Cocoon/bí đao Cocoon (Winter Melon Micellar Water).png"
  ],
  "rose-micellar": [
    "images/Tẩy trang Cocoon/hoa hồng Cocoon (Rose Micellar Water).jpg",
    "images/Tẩy trang Cocoon/hoa hồng Cocoon (Rose Micellar Water).png"
  ],
  "lotus-micellar": [
    "images/Tẩy trang Cocoon/sen Hậu Giang Cocoon.jpg",
    "images/Tẩy trang Cocoon/sen Hậu Giang Cocoon.png"
  ],

  /* Sữa rửa mặt: hiện thư mục ảnh chưa thấy sau khi tái cấu trúc, nên map tạm theo ảnh cùng brand (nếu có) để UI không bị trống */
  "sebium-gel-moussant-actif": ["images/Dưỡng ẩm Bioderma/Bioderma Sébium Hydra.png"],
  "atoderm-intensive-gel": ["images/Dưỡng ẩm Bioderma/Bioderma Atoderm Intensive Baume.jpg"],
  "sensibio-gel": ["images/Dưỡng ẩm Bioderma/Bioderma Sensibio Defensive.png"],
  "sebium-gel": ["images/Dưỡng ẩm Bioderma/Bioderma Sébium Hydra.png"],
  "green-tea-foam": ["images/Dưỡng ẩm Innisfree/Innisfree Green Tea Balancing Cream EX.png"],
  "volcanic-foam": ["images/Dưỡng ẩm Innisfree/Innisfree Bija Cica Balm EX.png"],
  "glycolic-cleanser": ["images/Dưỡng ẩm L_oreal/L’Oréal Hydra Genius Aloe Water.png"],
  "revitalift-foam": ["images/Dưỡng ẩm L_oreal/L’Oréal Revitalift Laser X3 Day Cream.png"],
  "winter-melon-cleanser": ["images/Dưỡng ẩm Cocoon/Thạch Bí Đao Cocoon Winter Melon Gel Cream.png"],
  "turmeric-cleanser": ["images/Dưỡng ẩm Cocoon/Thạch Nghệ Cocoon Turmeric Gel Cream.jpg"],
  "coffee-cleanser": ["images/Dưỡng ẩm Cocoon/Cocoon Rose Serum (dưỡng ẩm phục hồi).jpg"],
  "lotus-cleanser": ["images/Dưỡng ẩm Cocoon/Cocoon Sen Hậu Giang Multi Balm.png"]
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

// Keep original Vietnamese labels (with diacritics) for each slugified tag token.
// This lets UI show "có dấu" even though we keep `p.tags` slugified for filtering/search.
const TAG_LABELS_BY_SLUG = {};
const getTagLabel = (slug) => TAG_LABELS_BY_SLUG[slug] || displayMap[slug] || String(slug).replaceAll("-", " ");

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
        ? `<img src="${encodeURI(line.image)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'" />`
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

  const chips = (items, seed = p.slug) => {
    const arr = (items || []).filter(Boolean);
    if (!arr.length) return "";

    const initialCount = 8;
    const shown = arr.slice(0, initialCount);
    const extra = arr.slice(initialCount);
    const toggleKey = `${slugify(seed)}-chips`;

    const extraHtml = extra
      .map(
        (x, i) =>
          `<span class="chip chip-extra" data-chip-toggle-key="${toggleKey}" hidden data-chip-index="${i}">${getTagLabel(x)}</span>`
      )
      .join("");

    const baseHtml = `<div class="chips" data-chip-toggle-key="${toggleKey}">
      ${shown.map((x) => `<span class="chip">${getTagLabel(x)}</span>`).join("")}
      ${extraHtml}
      ${
        extra.length
          ? `<button class="chips-toggle btn-outline" type="button" data-action="toggleChips" data-chip-toggle-key="${toggleKey}" data-expanded="false" aria-label="Xem thêm thẻ"></button>`
          : ``
      }
    </div>`;

    return baseHtml;
  };

  els.modalBody.innerHTML = `
    <div class="pdp" data-slug="${p.slug}">
      <div>
        <div class="pdp-main">
          ${mainImg ? `<img src="${encodeURI(mainImg)}" alt="${p.name}" loading="lazy" />` : `<div class="thumb"></div>`}
        </div>
        ${
          imgs.length > 1
            ? `<div class="pdp-thumbs">
                ${imgs
                  .slice(0, 10)
                  .map(
                    (src, i) => `<button class="pdp-thumb ${i === safeIdx ? "active" : ""}" type="button" data-img-index="${i}">
                      <img src="${encodeURI(src)}" alt="${p.name} ${i + 1}" loading="lazy" />
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

        ${chips([...(p.tags || [])].map((t) => t), p.slug)}

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

const IMAGE_FILES_META = IMAGE_FILES.map((path) => {
  const tokens = slugify(path)
    .split("-")
    .map((t) => t.trim())
    .filter(Boolean);
  return { path, tokensSet: new Set(tokens) };
});

function productMatchTokens({ slug, brand, name, category, type }) {
  const parts = [slug, brand, name, category, type].filter(Boolean).slice(0, 5);
  const tokens = new Set();
  const ignore = new Set(["toner"]);
  parts.forEach((p) => {
    slugify(String(p))
      .split("-")
      .forEach((t) => {
        if (t && t.length > 2 && !ignore.has(t)) tokens.add(t);
      });
  });
  return [...tokens].slice(0, 14);
}

function guessImagesForProduct({ slug, brand, name, category, type }) {
  const tokens = productMatchTokens({ slug, brand, name, category, type });
  if (!tokens.length) return [];

  const catSlug = normalizeCategory(category || type || "");
  let metas = IMAGE_FILES_META;
  if (catSlug === "toner") {
    metas = IMAGE_FILES_META.filter((m) => m.path.startsWith("images/toner/"));
  } else if (catSlug === "tay-trang") {
    metas = IMAGE_FILES_META.filter((m) => slugify(m.path).includes("tay-trang"));
  } else if (catSlug === "sua-rua-mat") {
    metas = IMAGE_FILES_META.filter((m) => slugify(m.path).includes("sua-rua-mat"));
  } else if (["mat-na", "kem-chong-nang", "duong-am"].includes(catSlug)) {
    metas = IMAGE_FILES_META.filter((m) => slugify(m.path).includes(catSlug));
  }

  const scored = [];
  for (const meta of metas) {
    let score = 0;
    for (const t of tokens) {
      if (meta.tokensSet.has(t)) score += 2;
    }
    // Prefer filenames that contain the product slug tokens directly.
    const slugTokens = slugify(slug)
      .split("-")
      .filter((x) => x && x.length > 2 && x !== "toner");
    if (slugTokens.some((st) => meta.tokensSet.has(st))) score += 6;
    // Require at least a couple token matches; otherwise we risk picking images
    // that only share the brand name.
    if (score >= 4) scored.push([score, meta.path]);
  }
  scored.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));
  return scored.slice(0, 4).map(([, path]) => path);
}

function normalizeProduct(raw, idx) {
  const display = raw.display || {};
  const core = raw.core || {};
  const slug = raw.slug || slugify(`${raw.brand || ""}-${raw.name || display.title || `item-${idx + 1}`}`);
  const name = raw.name || display.title || slug;
  const brand = raw.brand || "Unknown";
  const catSlug = normalizeCategory(raw.category || raw.type);
  const rawShortDescription = raw.short_description || display.short_description || "";
  const fullDescription =
    raw.full_description ||
    raw.description ||
    display.full_description ||
    display.short_description ||
    rawShortDescription ||
    "";
  const shortDescription =
    rawShortDescription ||
    (fullDescription
      ? `${String(fullDescription).trim().slice(0, 120)}${String(fullDescription).trim().length > 120 ? "..." : ""}`
      : "");
  const imagesFromData = Array.isArray(raw.images) && raw.images.length
    ? raw.images
    : raw.image
      ? [raw.image]
      : [];
  let images = imagesFromData;
  if (!images.length) {
    // Keep existing hardcoded mappings for old products.
    const imagesFromMap = IMAGE_MAP[slug];
    if (Array.isArray(imagesFromMap) && imagesFromMap.length) {
      images = imagesFromMap;
    } else if (catSlug === "toner") {
      // For toner: auto-guess from /images/toner/.
      images = guessImagesForProduct({
        slug,
        brand,
        name,
        category: raw.category || raw.type,
        type: raw.type || ""
      });
    } else {
      // For newly added products without images, keep empty (user updates later).
      images = [];
    }
  }
  const rawTagCandidates =
    raw.tags ||
    [
      ...(display.highlights || []),
      ...(core.skin_type || raw.skin_type || []),
      ...(core.effects || raw.effects || []),
      ...(Array.isArray(raw.tags) ? raw.tags : [])
    ];

  const tags = rawTagCandidates
    .slice(0, 6)
    .map((v) => {
      if (typeof v === "string") {
        const sv = slugify(v);
        if (sv && !TAG_LABELS_BY_SLUG[sv]) TAG_LABELS_BY_SLUG[sv] = v;
        return sv;
      }
      if (typeof v === "number") return String(v);
      return "";
    })
    .filter(Boolean);

  return {
    id: raw.id || slug || `tmp-${idx + 1}`,
    slug,
    brand,
    name,
    category: catSlug,
    type: raw.type || "",
    skin_type: raw.skin_type || core.skin_type || [],
    tags,
    description: fullDescription,
    shortDescription,
    ingredients: raw.ingredients || core.ingredients || [],
    effects: raw.effects || core.effects || [],
    use_case:
      raw.use_case ||
      [
        raw.type || raw.category || "",
        ...(display.highlights || []),
        ...(core.effects || []),
        ...(core.skin_type || [])
      ].filter(Boolean),
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

  const maxShown = 12;
  tags.forEach((tag, idx) => {
    const b = document.createElement("button");
    b.className = `tag${idx >= maxShown ? " tag-extra" : ""}`;
    if (idx >= maxShown) b.hidden = true;
    b.dataset.tag = tag;
    b.textContent = getTagLabel(tag);
    els.tagFilters.append(b);
  });

  if (tags.length > maxShown) {
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "chips-toggle btn-outline";
    toggleBtn.type = "button";
    toggleBtn.dataset.action = "toggleTagFilters";
    toggleBtn.dataset.expanded = "false";
    toggleBtn.textContent = "";
    toggleBtn.setAttribute("aria-label", "Xem thêm thẻ");
    els.tagFilters.append(toggleBtn);
  }
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
        ${p.image ? `<img class="thumb" src="${encodeURI(p.image)}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'thumb\\'></div>')" />` : `<div class="thumb"></div>`}
        <div class="card-body">
          <div class="meta">${p.brand} • ${displayLabel(p.category)}</div>
          <h3>${p.name}</h3>
          <p class="meta">${p.shortDescription || p.description || ""}</p>
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
            ${p.image ? `<img src="${encodeURI(p.image)}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" />` : `<div class="thumb"></div>`}
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

    if (action === "toggleChips") {
      const toggleKey = btn.dataset.chipToggleKey;
      const expanded = btn.dataset.expanded === "true";
      const nextExpanded = !expanded;
      const nodes = els.modalBody.querySelectorAll(`.chip-extra[data-chip-toggle-key="${toggleKey}"]`);
      nodes.forEach((node) => {
        node.hidden = !nextExpanded;
      });
      btn.dataset.expanded = nextExpanded ? "true" : "false";
      btn.setAttribute("aria-label", nextExpanded ? "Rút gọn thẻ" : "Xem thêm thẻ");
    }
  });

  els.tagFilters.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("[data-action='toggleTagFilters']");
    if (toggleBtn) {
      const expanded = toggleBtn.dataset.expanded === "true";
      const nextExpanded = !expanded;
      const extraTags = els.tagFilters.querySelectorAll(".tag-extra");
      extraTags.forEach((t) => {
        t.hidden = !nextExpanded;
      });
      toggleBtn.dataset.expanded = nextExpanded ? "true" : "false";
      toggleBtn.setAttribute("aria-label", nextExpanded ? "Thu gọn thẻ" : "Xem thêm thẻ");
      return;
    }

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

  // Rebuild tag label map for this page load.
  Object.keys(TAG_LABELS_BY_SLUG).forEach((k) => delete TAG_LABELS_BY_SLUG[k]);

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
