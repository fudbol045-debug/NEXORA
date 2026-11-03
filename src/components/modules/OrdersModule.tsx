import React, { useState } from 'react';
import {
  Package,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth } from '../../context/AuthContext';
import { DisputeFileModal } from '../modals/DisputeFileModal';
import { DisputeRoomModal } from '../modals/DisputeRoomModal';

export const OrdersModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus, disputes } = usePlatform();

  const [activeTab, setActiveTab] = useState<'all' | 'my_purchases' | 'my_sales' | 'disputed'>('all');
  const [selectedDisputeFileOrder, setSelectedDisputeFileOrder] = useState<Order | null>(null);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [viewInvoiceOrder, setViewInvoiceOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'my_purchases') return o.buyerId === currentUser.id;
    if (activeTab === 'my_sales') return o.sellerId === currentUser.id;
    if (activeTab === 'disputed') return o.status === 'disputed';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">Yangi Buyurtma</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">Tasdiqlandi</span>;
      case 'preparing':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">Tayyorlanmoqda</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">Yo‘lda / Jo‘natildi</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-teal-950 text-teal-300 border border-teal-800">Yetkazib Berildi</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">Yakunlandi</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">Bekor Qilindi</span>;
      case 'disputed':
        return <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-600 animate-pulse">Dispute / E'tirozda</span>;
    }
  };

  const activeDispute = disputes.find((d) => d.id === selectedDisputeId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-400" />
            NEXORA ORDERS & Escrow To‘lovlari
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Har bir buyurtma xavfsiz Escrow depoziti, real vaqtli kuzatuv va nizolarni hal qilish tizimi bilan himoyalangan.
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          {[
            { id: 'all', label: `Barchasi (${orders.length})` },
            { id: 'my_purchases', label: 'Mening Xaridlarim' },
            { id: 'my_sales', label: 'Mening Sotuvlarim' },
            { id: 'disputed', label: `Dispute (${orders.filter((o) => o.status === 'disputed').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
            <Package className="w-10 h-10 mx-auto text-slate-600" />
            <div className="text-sm font-medium text-slate-300">Ushbu toifada buyurtmalar mavjud emas</div>
            <p className="text-xs text-slate-500">
              NEXORA MARKET, SERVICES yoki CARGO orqali buyurtma berishingiz mumkin.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isBuyer = order.buyerId === currentUser.id;
            const isSeller = order.sellerId === currentUser.id;
            const hasDispute = !!order.disputeId;

            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-200 text-sm">
                      #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    {order.isEscrowProtected && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Escrow Himoyalangan
                      </span>
                    )}
                  </div>

                  <div className="text-slate-400 text-[11px]">
                    Sana: <span className="font-mono text-slate-300">{order.createdAt}</span>
                  </div>
                </div>

                {/* Product/Service Details */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={order.listingImage}
                      alt={order.listingTitle}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 hover:text-indigo-400 transition cursor-pointer">
                        {order.listingTitle}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{order.listingType}</span>
                        <span>•</span>
                        <span>Soni: {order.quantity} dona</span>
                        <span>•</span>
                        <span>Sotuvchi: <strong className="text-indigo-300">{order.sellerName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Financial calculation */}
                  <div className="text-right">
                    <div className="text-base font-bold text-slate-100 font-mono">
                      ${order.totalAmount.toLocaleString()} {order.currency}
                    </div>
                    {order.pointsRedeemed && order.pointsRedeemed > 0 ? (
                      <div className="text-[11px] text-amber-400">
                        Chegirma: -${order.discountAmount} ({order.pointsRedeemed} ball)
                      </div>
                    ) : null}
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                      To‘lov: {order.paymentMethod.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Tracking & Delivery address snippet */}
                {order.trackingNumber && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span>Kuzatuv (CARGO Tracking):</span>
                      <strong className="font-mono text-cyan-300">{order.trackingNumber}</strong>
                    </div>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      Manzil: {order.deliveryAddress.city}, {order.deliveryAddress.country}
                    </span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80 text-xs">
                  {/* Status update transitions for seller */}
                  {isSeller && order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'disputed' && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Holatni yangilash:</span>
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                        >
                          Tayyorlanmoqda
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                        >
                          Jo‘natildi (Shipped)
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                        >
                          Yetkazildi
                        </button>
                      )}
                    </div>
                  )}

                  {/* Buyer confirm receipt */}
                  {isBuyer && order.status === 'delivered' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Qabul Qildim (Yakunlash & Escrow Yechish)
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    {/* View Invoice */}
                    <button
                      onClick={() => setViewInvoiceOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Kvitansiya (Invoice)
                    </button>

                    {/* DISPUTE SYSTEM INTEGRATION */}
                    {hasDispute ? (
                      <button
                        onClick={() => setSelectedDisputeId(order.disputeId!)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-600 hover:bg-amber-600/30 font-semibold flex items-center gap-1.5 transition"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        Dispute Xonasiga O‘tish
                      </button>
                    ) : (
                      order.status !== 'cancelled' &&
                      order.status !== 'completed' && (
                        <button
                          onClick={() => setSelectedDisputeFileOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800 hover:bg-rose-900/50 font-medium flex items-center gap-1.5 transition"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          E'tiroz / Dispute Ochish
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dispute File Modal */}
      {selectedDisputeFileOrder && (
        <DisputeFileModal
          order={selectedDisputeFileOrder}
          isOpen={!!selectedDisputeFileOrder}
          onClose={() => setSelectedDisputeFileOrder(null)}
          onDisputeCreated={(id) => {
            setSelectedDisputeId(id);
          }}
        />
      )}

      {/* Dispute Room Modal */}
      {activeDispute && (
        <DisputeRoomModal
          dispute={activeDispute}
          isOpen={!!activeDispute}
          onClose={() => setSelectedDisputeId(null)}
        />
      )}

      {/* Invoice Modal */}
      {viewInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">NEXORA Rasmiy Kvitansiyasi</h3>
                <p className="text-slate-400">Order #{viewInvoiceOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setViewInvoiceOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Tovar / Xizmat:</span>
                <span className="font-semibold text-white">{viewInvoiceOrder.listingTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sotuvchi:</span>
                <span>{viewInvoiceOrder.sellerName} ({viewInvoiceOrder.sellerNexoraId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Xaridor:</span>
                <span>{viewInvoiceOrder.buyerName} ({viewInvoiceOrder.buyerNexoraId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Manzil:</span>
                <span>{viewInvoiceOrder.deliveryAddress.street}, {viewInvoiceOrder.deliveryAddress.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To‘lov Usuli:</span>
                <span>Escrow Himoyalangan ({viewInvoiceOrder.paymentMethod})</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm text-emerald-400">
                <span>Jami To‘langan:</span>
                <span className="font-mono">${viewInvoiceOrder.totalAmount} {viewInvoiceOrder.currency}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewInvoiceOrder(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
