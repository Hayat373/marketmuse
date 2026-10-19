import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { Product } from "../data/products";
import { sound } from "../audio/soundEngine";

export type CartItem = {
  product: Product;
  quantity: number;
};

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onChangeQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onSelectProduct: (product: Product) => void;
  onNotify: (msg: string) => void;
}

export function BagDrawer({
  isOpen,
  onClose,
  cart,
  onChangeQuantity,
  onRemoveItem,
  onSelectProduct,
  onNotify,
}: BagDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = Math.max(0, subtotal * (1 - discount));

  function handleApplyPromo() {
    sound.playClick();
    if (promoCode.trim().toUpperCase() === "4DLUXURY" || promoCode.trim().toUpperCase() === "MARKETMUSE") {
      setDiscount(0.2); // 20% discount
      setPromoApplied(true);
      sound.playAddBag();
      onNotify("20% Chrono Voucher applied!");
    } else {
      onNotify("Invalid code. Try '4DLUXURY'");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              sound.playClose();
              onClose();
            }
          }}
        >
          <motion.aside
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="drawer-header">
              <div>
                <span className="section-eyebrow">YOUR 4D SELECTION</span>
                <h2>Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  sound.playClose();
                  onClose();
                }}
                aria-label="Close Bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={42} strokeWidth={1} />
                  <h3>Your dimensional bag is empty.</h3>
                  <p>Explore the boutique to inspect and collect our latest 4D pieces.</p>
                  <button
                    className="add-cart-button"
                    onClick={() => {
                      sound.playClick();
                      onClose();
                    }}
                  >
                    EXPLORE THE BOUTIQUE <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div className="cart-item" key={product.id}>
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      style={{ cursor: "pointer" }}
                    />

                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <span>{product.category}</span>
                        <span className="cart-item-coord">
                          4D: [{product.coord4D[0]}, {product.coord4D[1]}]
                        </span>
                      </div>

                      <h3
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {product.name}
                      </h3>
                      <p className="cart-item-price">${product.price}.00 USD</p>

                      <div className="quantity-control">
                        <button
                          onClick={() => {
                            sound.playClick();
                            onChangeQuantity(product.id, -1);
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => {
                            sound.playClick();
                            onChangeQuantity(product.id, 1);
                          }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <button
                      className="remove-item"
                      onClick={() => {
                        sound.playClick();
                        onRemoveItem(product.id);
                      }}
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary & Promo */}
            {cart.length > 0 && (
              <div className="cart-summary">
                {/* Promo Code Input */}
                <div className="promo-row">
                  <input
                    type="text"
                    placeholder="PROMO CODE (TRY '4DLUXURY')"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="promo-input"
                  />
                  <button
                    className="promo-apply-btn"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode.trim()}
                  >
                    {promoApplied ? <Check size={14} /> : "APPLY"}
                  </button>
                </div>

                <div className="summary-line">
                  <span>SUBTOTAL</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="summary-line discount-line">
                    <span>CHRONO VOUCHER (20%)</span>
                    <span>-${(subtotal * discount).toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-line summary-total">
                  <span>TOTAL ESTIMATE</span>
                  <strong>${total.toFixed(2)} USD</strong>
                </div>

                <p className="summary-shipping-note">
                  ✦ Complimentary insured hyper-courier delivery included on all orders.
                </p>

                <button
                  className="add-cart-button checkout-btn"
                  onClick={() => {
                    sound.playAddBag();
                    onNotify("Order confirmed! Transmitting 4D coordinates to logistics.");
                  }}
                >
                  COMPLETE CHRONO CHECKOUT <ArrowRight size={16} />
                </button>

                <button
                  className="continue-shopping"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                >
                  RETURN TO GALLERY
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
