import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { closeCart, updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { QuickLogin } from './QuickLogin';

export const CartDrawer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, total, isCartOpen } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);
    const [showLogin, setShowLogin] = useState(false);

    const handleClose = () => {
        setShowLogin(false); // Reset login view on close
        dispatch(closeCart());
    };

    const handleProceed = () => {
        if (user) {
            handleClose();
            navigate('/checkout');
        }
        // If not user, QuickLogin is shown in the drawer directly
    };

    return (
        <Transition.Root show={isCartOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                                    Shopping Cart ({items.length})
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 outline-none"
                                                        onClick={handleClose}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <FiX className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Free Shipping Progress Bar */}
                                            <div className="mt-4 mb-2">
                                                {total >= 999 ? (
                                                    <div className="bg-accent/10 border border-accent/20 rounded-md p-3 text-center">
                                                        <p className="text-sm font-bold text-accent">🎉 You've unlocked FREE Shipping!</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-600">
                                                            Add <span className="font-bold text-black">₹{999 - total}</span> more for <span className="font-bold text-accent">FREE Shipping</span>
                                                        </p>
                                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                            <div
                                                                className="bg-black h-full rounded-full transition-all duration-500 ease-out"
                                                                style={{ width: `${(total / 999) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    {items.length === 0 ? (
                                                        <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
                                                    ) : (
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                            {items.map((item) => (

                                                                <li key={item.id} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            className="h-full w-full object-cover object-center"
                                                                        />
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                <h3 className="line-clamp-2">
                                                                                    <a href="#">{item.name}</a>
                                                                                </h3>
                                                                                <p className="ml-4">₹{item.price}</p>
                                                                            </div>
                                                                            {item.selectedAttributes && (
                                                                                <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                                                                                    {Object.entries(item.selectedAttributes).map(([key, value]) => (
                                                                                        <div key={key}>
                                                                                            <span className="font-medium">{key}:</span> {value}
                                                                                        </div>
                                                                                    ))}
                                                                                    {item.fragrance && (
                                                                                        <div>
                                                                                            <span className="font-medium">Fragrance:</span> {item.fragrance}
                                                                                        </div>
                                                                                    )}
                                                                                    {item.fragrances && item.fragrances.length > 0 && (
                                                                                        <div className="text-blue-600 italic">
                                                                                            <span className="font-medium not-italic">Fragrances:</span> {item.fragrances.join(', ')}
                                                                                        </div>
                                                                                    )}
                                                                                    {item.giftCustomization?.active && (
                                                                                        <div className="mt-1 p-2 bg-[#F5EFE8] rounded-md border border-gray-100 text-[#2A2421]">
                                                                                            <div className="text-[9px] font-bold uppercase opacity-50">Gift Message</div>
                                                                                            <div className="text-[11px] font-medium">{item.giftCustomization.occasion}</div>
                                                                                            <div className="text-[10px] italic leading-tight mt-0.5">"{item.giftCustomization.message}"</div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                            <p className="mt-1 text-sm text-gray-500">{item.originalPrice ? `₹${item.originalPrice}` : ''}</p>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex items-center border rounded-sm">
                                                                                <button
                                                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                                                                                    className="px-2 py-1 hover:bg-gray-100"
                                                                                >
                                                                                    <FiMinus className="w-3 h-3" />
                                                                                </button>
                                                                                <span className="px-2 text-gray-900">{item.quantity}</span>
                                                                                <button
                                                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                                                    className="px-2 py-1 hover:bg-gray-100"
                                                                                >
                                                                                    <FiPlus className="w-3 h-3" />
                                                                                </button>
                                                                            </div>

                                                                            <div className="flex">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                                                    className="font-medium text-red-600 hover:text-red-500"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                                                <p>Subtotal</p>
                                                <p>₹{total}</p>
                                            </div>

                                            {/* Logic: If user logged in OR simplified checkout needed */}
                                            {items.length > 0 && (
                                                <div className="mt-6">
                                                    {!user && !showLogin ? (
                                                        <button
                                                            onClick={() => setShowLogin(true)}
                                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
                                                        >
                                                            Proceed to Checkout
                                                        </button>
                                                    ) : !user && showLogin ? (
                                                        <QuickLogin onSuccess={() => {
                                                            navigate('/checkout');
                                                            handleClose();
                                                        }} />
                                                    ) : (
                                                        <button
                                                            onClick={handleProceed}
                                                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
                                                        >
                                                            Checkout
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                <p>
                                                    or{' '}
                                                    <button
                                                        type="button"
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                        onClick={handleClose}
                                                    >
                                                        Continue Shopping
                                                        <span aria-hidden="true"> &rarr;</span>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
