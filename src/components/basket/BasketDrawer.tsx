import React, { useState } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const BasketDrawer: React.FC = () => {
  const language = useLibraryStore((s) => s.language);
  const basket = useLibraryStore((s) => s.basket);
  const isBasketOpen = useLibraryStore((s) => s.isBasketOpen);
  const setIsBasketOpen = useLibraryStore((s) => s.setIsBasketOpen);
  const updateQuantity = useLibraryStore((s) => s.updateQuantity);
  const removeFromBasket = useLibraryStore((s) => s.removeFromBasket);
  const clearBasket = useLibraryStore((s) => s.clearBasket);
  const selectBook = useLibraryStore((s) => s.selectBook);

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'success'>('cart');

  if (!isBasketOpen) return null;

  const totalQuantity = basket.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = basket.reduce(
    (acc, item) => acc + item.book.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setCheckoutStep('success');
  };

  const handleFinishCheckout = () => {
    clearBasket();
    setCheckoutStep('cart');
    setIsBasketOpen(false);
  };

  const handleClose = () => {
    setIsBasketOpen(false);
    setCheckoutStep('cart');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: language === 'ar' ? 'flex-start' : 'flex-end',
        background: 'rgba(5, 8, 14, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}
      onClick={handleClose}
    >
      <div
        data-testid="basket-drawer"
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(16, 21, 30, 0.96)',
          borderLeft: language === 'ar' ? 'none' : '1px solid rgba(229, 179, 100, 0.2)',
          borderRight: language === 'ar' ? '1px solid rgba(229, 179, 100, 0.2)' : 'none',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(229, 179, 100, 0.15)',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                {language === 'ar'
                  ? 'سلة المشتريات'
                  : language === 'fr'
                  ? 'Panier de commande'
                  : 'Shopping Basket'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {totalQuantity}{' '}
                {language === 'ar'
                  ? 'كتب محددة'
                  : language === 'fr'
                  ? 'manuels sélectionnés'
                  : 'items selected'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {basket.length > 0 && checkoutStep === 'cart' && (
              <button
                data-testid="clear-basket-btn"
                onClick={clearBasket}
                className="glass-panel-interactive"
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid rgba(239, 68, 68, 0.25)'
                }}
                title={language === 'ar' ? 'إفراغ السلة' : 'Clear basket'}
              >
                <Trash2 size={13} />
                <span>{language === 'ar' ? 'إفراغ' : 'Clear'}</span>
              </button>
            )}

            <button
              data-testid="close-basket-btn"
              onClick={handleClose}
              className="glass-panel-interactive"
              style={{
                padding: '6px',
                borderRadius: '8px',
                color: '#94a3b8',
                display: 'flex'
              }}
              title={language === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body: Cart list or Success screen */}
        {checkoutStep === 'cart' ? (
          <>
            <div
              data-testid="basket-items-container"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {basket.length === 0 ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#64748b',
                    gap: '12px'
                  }}
                >
                  <ShoppingBag size={48} color="#475569" />
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8' }}>
                    {language === 'ar'
                      ? 'سلتك فارغة حالياً'
                      : language === 'fr'
                      ? 'Votre panier est vide'
                      : 'Your basket is empty'}
                  </p>
                  <span style={{ fontSize: '0.8rem', maxWidth: '240px' }}>
                    {language === 'ar'
                      ? 'اختر كتباً من الرفوف وانقر على "إضافة للسلة" لتجميع مستلزماتك المدرسية'
                      : 'Browse the 3D library and click "Add to Basket" to populate your list.'}
                  </span>
                </div>
              ) : (
                basket.map(({ book, quantity }) => {
                  const level = EDUCATION_LEVELS.find((l) => l.id === book.educationLevelId);
                  const itemTotal = book.price * quantity;

                  return (
                    <div
                      key={book.id}
                      data-testid={`basket-item-${book.id}`}
                      className="glass-panel"
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Book Mini Thumbnail */}
                        <div
                          onClick={() => {
                            selectBook(book.id);
                            setIsBasketOpen(false);
                          }}
                          style={{
                            width: '40px',
                            height: '54px',
                            borderRadius: '4px',
                            background: book.coverStyle.primaryColor,
                            border: `2px solid ${book.coverStyle.accentColor || '#fbbf24'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            cursor: 'pointer',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                          }}
                          title={language === 'ar' ? 'معاينة في الفضاء 3D' : 'Inspect in 3D'}
                        >
                          <BookOpen size={16} />
                        </div>

                        {/* Title & Level */}
                        <div style={{ flex: 1, minWidth: 0, textAlign: language === 'ar' ? 'right' : 'left' }}>
                          <h4
                            onClick={() => {
                              selectBook(book.id);
                              setIsBasketOpen(false);
                            }}
                            style={{
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: '#f8fafc',
                              margin: 0,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {book.title[language] || book.title.ar}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                            <span style={{ fontSize: '0.72rem', color: book.coverStyle.accentColor || '#fbbf24' }}>
                              {book.subject[language] || book.subject.ar}
                            </span>
                            {level && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  background: level.badgeColor,
                                  color: '#fff',
                                  padding: '1px 6px',
                                  borderRadius: '6px'
                                }}
                              >
                                {level.shortName[language] || level.shortName.ar}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          data-testid={`remove-item-${book.id}`}
                          onClick={() => removeFromBasket(book.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            transition: 'color 0.15s'
                          }}
                          title={language === 'ar' ? 'حذف' : 'Remove'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls & Price */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                      >
                        {/* Qty increment / decrement */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '8px',
                            padding: '2px 4px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            gap: '8px'
                          }}
                        >
                          <button
                            data-testid={`qty-minus-${book.id}`}
                            onClick={() => updateQuantity(book.id, -1)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#cbd5e1',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            data-testid={`qty-value-${book.id}`}
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: '#f8fafc',
                              minWidth: '18px',
                              textAlign: 'center'
                            }}
                          >
                            {quantity}
                          </span>
                          <button
                            data-testid={`qty-plus-${book.id}`}
                            onClick={() => updateQuantity(book.id, 1)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#cbd5e1',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px'
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price Calculation */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginInlineEnd: '4px' }}>
                            ({book.price.toFixed(3)} x {quantity})
                          </span>
                          <span
                            data-testid={`item-price-${book.id}`}
                            style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fbbf24' }}
                          >
                            {itemTotal.toFixed(3)}{' '}
                            <span style={{ fontSize: '0.75rem' }}>{book.currency[language] || book.currency.ar}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Checkout Summary */}
            {basket.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  background: 'rgba(10, 13, 18, 0.85)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    {language === 'ar' ? 'المجموع الإجمالي:' : language === 'fr' ? 'Sous-total:' : 'Total:'}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      data-testid="basket-total-price"
                      style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}
                    >
                      {totalPrice.toFixed(3)}{' '}
                      <span style={{ fontSize: '0.85rem' }}>
                        {basket[0]?.book.currency[language] || basket[0]?.book.currency.ar}
                      </span>
                    </span>
                  </div>
                </div>

                <button
                  data-testid="checkout-btn"
                  onClick={handleCheckout}
                  className="glass-panel-interactive"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #c4823f, #e5b364)',
                    color: '#1e140d',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(229, 179, 100, 0.35)'
                  }}
                >
                  <Sparkles size={18} />
                  <span>
                    {language === 'ar'
                      ? 'تأكيد طلب الكتب المدرسية'
                      : language === 'fr'
                      ? 'Confirmer la commande'
                      : 'Simulate Order Checkout'}
                  </span>
                  {language === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Simulated Order Confirmation Screen */
          <div
            data-testid="checkout-success-view"
            style={{
              flex: 1,
              padding: '36px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(74, 222, 128, 0.25)'
              }}
            >
              <CheckCircle size={36} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              {language === 'ar'
                ? 'تم تسجيل طلبك بنجاح!'
                : language === 'fr'
                ? 'Commande validée avec succès !'
                : 'Order Simulated Successfully!'}
            </h3>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', maxWidth: '320px' }}>
              {language === 'ar'
                ? `تم تجهيز طلب ${totalQuantity} كتب مدرسية بمجموع ${totalPrice.toFixed(3)} د.ت. هذه نسخة استعراضية جاهزة للربط المستقبلي مع بوابات الدفع.`
                : `Your simulated basket of ${totalQuantity} schoolbooks totaling ${totalPrice.toFixed(3)} TND has been processed successfully.`}
            </p>

            <button
              data-testid="return-to-library-btn"
              onClick={handleFinishCheckout}
              className="glass-panel-interactive"
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #c4823f, #e5b364)',
                color: '#1e140d',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {language === 'ar'
                ? 'متابعة استكشاف المكتبة'
                : language === 'fr'
                ? 'Continuer la visite'
                : 'Continue Exploring Library'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
