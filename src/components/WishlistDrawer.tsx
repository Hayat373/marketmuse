import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Box, Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { products } from "../data/products";
import type { Product } from "../data/products";
import { sound } from "../audio/soundEngine";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
}: WishlistDrawerProps) {
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

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
            className="cart-drawer saved-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: "easeInOut" }}
          >
            <div className="drawer-header">
              <div>
                <span className="section-eyebrow">CURATED PIECES</span>
                <h2>Saved in Hyperspace ({wishlist.length})</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  sound.playClose();
                  onClose();
                }}
                aria-label="Close Saved Pieces"
              >
                <X size={20} />
              </button>
            </div>

            <div className="cart-items">
              {wishlistedProducts.length === 0 ? (
                <div className="empty-cart">
                  <Heart size={40} strokeWidth={1} />
                  <h3>No pieces saved yet.</h3>
                  <p>Tap the heart icon on any product card to curate your personal 4D capsule.</p>
                  <button
                    className="add-cart-button"
                    onClick={() => {
                      sound.playClick();
                      onClose();
                    }}
                  >
                    EXPLORE COLLECTION <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                wishlistedProducts.map((product) => (
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
                          W: {product.coord4D[3] > 0 ? `+${product.coord4D[3]}` : product.coord4D[3]}
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

                      <div className="saved-item-actions">
                        <button
                          className="saved-view"
                          onClick={() => {
                            sound.playInspect();
                            onClose();
                            onSelectProduct(product);
                          }}
                        >
                          <Box size={13} />
                          <span>4D INSPECT</span>
                        </button>

                        <button
                          className="saved-move-bag"
                          onClick={() => {
                            sound.playAddBag();
                            onAddToCart(product);
                          }}
                        >
                          <ShoppingBag size={13} />
                          <span>BAG</span>
                        </button>
                      </div>
                    </div>

                    <button
                      className="remove-item"
                      onClick={() => {
                        sound.playClick();
                        onToggleWishlist(product.id);
                      }}
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
