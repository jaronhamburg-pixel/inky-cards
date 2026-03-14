'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  signUpSchema, type SignUpFormData,
  signInSchema, type SignInFormData,
  profileSchema, type ProfileFormData,
  addressSchema, type AddressFormData,
} from '@/lib/utils/validation';
import { formatPrice, formatDate } from '@/lib/utils/formatting';
import Link from 'next/link';
import Image from 'next/image';
import { PublicUser, UserAddress } from '@/types/user';
import { Order } from '@/types/order';
import { SavedDesign } from '@/types/saved-design';

type Tab = 'profile' | 'addresses' | 'orders' | 'saved-designs';

export default function AccountPage() {
  const { user, isLoading, signIn, signUp, signOut, refreshUser } = useAuth();

  if (isLoading) {
    return (
      <div className="container-luxury py-20 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 bg-silk rounded w-48 mx-auto mb-8 animate-pulse" />
          <div className="bg-white border border-silk rounded-lg p-8 space-y-4">
            <div className="h-4 bg-silk rounded w-full animate-pulse" />
            <div className="h-4 bg-silk rounded w-3/4 animate-pulse" />
            <div className="h-10 bg-silk rounded w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForms signIn={signIn} signUp={signUp} />;
  }

  return <AccountDashboard user={user} signOut={signOut} refreshUser={refreshUser} />;
}

// ─── Auth Forms ──────────────────────────────────────────

function AuthForms({
  signIn,
  signUp,
}: {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: string }>;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="container-luxury py-20 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="heading-display text-ink mb-3">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="text-stone text-sm">
            {isSignUp
              ? 'Join Inky Cards for personalised card recommendations and order tracking.'
              : 'Welcome back. Sign in to your account.'}
          </p>
        </div>

        <div className="bg-white border border-silk rounded-lg p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {isSignUp ? (
            <SignUpForm
              onSubmit={async (data) => {
                setError('');
                const result = await signUp(data.email, data.password, data.firstName, data.lastName);
                if (result.error) setError(result.error);
              }}
            />
          ) : (
            <SignInForm
              onSubmit={async (data) => {
                setError('');
                const result = await signIn(data.email, data.password);
                if (result.error) setError(result.error);
              }}
            />
          )}

          <div className="mt-6 pt-6 border-t border-silk text-center">
            <p className="text-sm text-stone">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <br />
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="text-ink font-medium hover:underline uppercase mt-2 inline-block"
              >
                {isSignUp ? 'Sign In' : 'Create'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function SignInForm({ onSubmit }: { onSubmit: (data: SignInFormData) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input {...register('email')} label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} required />
      <Input {...register('password')} label="Password" type="password" placeholder="Enter your password" error={errors.password?.message} required />
      <Button size="lg" variant="primary" className="w-full" type="submit" isLoading={isSubmitting}>
        Sign In
      </Button>
    </form>
  );
}

function SignUpForm({ onSubmit }: { onSubmit: (data: SignUpFormData) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input {...register('firstName')} label="First Name" placeholder="Jane" error={errors.firstName?.message} required />
        <Input {...register('lastName')} label="Last Name" placeholder="Smith" error={errors.lastName?.message} required />
      </div>
      <Input {...register('email')} label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} required />
      <Input {...register('password')} label="Password" type="password" placeholder="At least 6 characters" error={errors.password?.message} required />
      <Input {...register('confirmPassword')} label="Confirm Password" type="password" placeholder="Confirm your password" error={errors.confirmPassword?.message} required />
      <Button size="lg" variant="primary" className="w-full" type="submit" isLoading={isSubmitting}>
        Create Account
      </Button>
    </form>
  );
}

// ─── Account Dashboard ───────────────────────────────────

function AccountDashboard({
  user,
  signOut,
  refreshUser,
}: {
  user: PublicUser;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'orders', label: 'Orders' },
    { key: 'saved-designs', label: 'Designs' },
  ];

  return (
    <div className="container-luxury py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <div className="text-center">
            <h1 className="heading-display text-ink">My Account</h1>
            <p className="text-stone text-sm mt-1">Welcome back, {user.firstName}</p>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-silk mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm tracking-widest uppercase transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-ink text-ink font-medium'
                  : 'border-transparent text-stone hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileTab user={user} refreshUser={refreshUser} />}
        {activeTab === 'addresses' && <AddressesTab user={user} refreshUser={refreshUser} />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'saved-designs' && <SavedDesignsTab />}
      </div>
    </div>
  );
}

// ─── Profile Tab ─────────────────────────────────────────

function ProfileTab({ user, refreshUser }: { user: PublicUser; refreshUser: () => Promise<void> }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setError('');
    setSuccess(false);
    const res = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || 'Failed to update profile');
      return;
    }

    await refreshUser();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-silk rounded-lg p-8">
      <h2 className="text-lg font-medium text-ink mb-6">Profile Details</h2>

      {success && (
        <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          Profile updated successfully
        </div>
      )}
      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input {...register('firstName')} label="First Name" error={errors.firstName?.message} required />
          <Input {...register('lastName')} label="Last Name" error={errors.lastName?.message} required />
        </div>
        <Input label="Email" value={user.email} disabled />
        <Input {...register('phone')} label="Phone" type="tel" error={errors.phone?.message} />
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}

// ─── Addresses Tab ───────────────────────────────────────

function AddressesTab({ user, refreshUser }: { user: PublicUser; refreshUser: () => Promise<void> }) {
  const [addresses, setAddresses] = useState<UserAddress[]>(user.addresses);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const reload = async () => {
    const res = await fetch('/api/account/addresses');
    if (res.ok) {
      const data = await res.json();
      setAddresses(data.addresses);
    }
    await refreshUser();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    if (res.ok) await reload();
  };

  return (
    <div className="space-y-6">
      {addresses.map((addr) =>
        editingId === addr.id ? (
          <AddressForm
            key={addr.id}
            address={addr}
            onSave={async (data) => {
              await fetch(`/api/account/addresses/${addr.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              setEditingId(null);
              await reload();
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div key={addr.id} className="bg-white border border-silk rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-ink">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] uppercase tracking-wider bg-ink text-white px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone">
                  {addr.firstName} {addr.lastName}
                </p>
                <p className="text-sm text-stone">{addr.address}</p>
                <p className="text-sm text-stone">
                  {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}
                </p>
                <p className="text-sm text-stone">{addr.country}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(addr.id)}
                  className="text-xs uppercase tracking-wider text-stone hover:text-ink transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {addresses.length === 0 && !showNew && (
        <div className="bg-white border border-silk rounded-lg p-8 text-center">
          <p className="text-stone text-sm mb-4">No saved addresses yet</p>
        </div>
      )}

      {showNew ? (
        <AddressForm
          onSave={async (data) => {
            await fetch('/api/account/addresses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            setShowNew(false);
            await reload();
          }}
          onCancel={() => setShowNew(false)}
        />
      ) : (
        <Button variant="outline" onClick={() => setShowNew(true)}>
          Add New Address
        </Button>
      )}
    </div>
  );
}

function AddressForm({
  address,
  onSave,
  onCancel,
}: {
  address?: UserAddress;
  onSave: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          label: address.label,
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
          isDefault: address.isDefault,
        }
      : {
          label: '',
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          country: 'GB',
          isDefault: false,
        },
  });

  return (
    <div className="bg-white border border-silk rounded-lg p-6">
      <h3 className="text-lg font-medium text-ink mb-4">
        {address ? 'Edit Address' : 'New Address'}
      </h3>
      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        <Input {...register('label')} label="Label" placeholder="Home, Work, etc." error={errors.label?.message} required />
        <div className="grid grid-cols-2 gap-4">
          <Input {...register('firstName')} label="First Name" error={errors.firstName?.message} required />
          <Input {...register('lastName')} label="Last Name" error={errors.lastName?.message} required />
        </div>
        <Input {...register('address')} label="Street Address" error={errors.address?.message} required />
        <div className="grid grid-cols-2 gap-4">
          <Input {...register('city')} label="City" error={errors.city?.message} required />
          <Input {...register('state')} label="County / State" error={errors.state?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input {...register('zip')} label="Postcode" error={errors.zip?.message} required />
          <Input {...register('country')} label="Country" error={errors.country?.message} required />
        </div>
        <label className="flex items-center gap-2 text-sm text-stone cursor-pointer">
          <input type="checkbox" {...register('isDefault')} className="rounded border-silk" />
          Set as default address
        </label>
        <div className="flex gap-3">
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {address ? 'Save' : 'Add Address'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Orders Tab ──────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/account/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(
          (data.orders || []).map((o: Order) => ({
            ...o,
            createdAt: new Date(o.createdAt),
            updatedAt: new Date(o.updatedAt),
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    printing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-silk rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-silk rounded w-32 mb-3" />
            <div className="h-3 bg-silk rounded w-48 mb-2" />
            <div className="h-3 bg-silk rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-silk rounded-lg p-8 text-center">
        <p className="text-stone text-sm mb-2">No orders yet</p>
        <p className="text-stone text-xs">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`} className="block bg-white border border-silk rounded-lg p-6 hover:border-stone transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-medium text-ink">{order.orderNumber}</span>
              <p className="text-xs text-stone mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border ${statusStyles[order.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
              {order.status}
            </span>
          </div>
          <div className="space-y-1 mb-3">
            {order.items.map((item) => (
              <p key={item.id} className="text-sm text-stone">
                {item.card.title} &times; {item.quantity}
              </p>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-silk">
            <span className="text-sm text-stone">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
            <span className="font-medium text-ink">{formatPrice(order.total)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Saved Designs Tab ───────────────────────────────────

function SavedDesignsTab() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    fetch('/api/account/saved-designs')
      .then((res) => res.json())
      .then((data) => {
        setDesigns(
          (data.designs || []).map((d: SavedDesign) => ({
            ...d,
            createdAt: new Date(d.createdAt),
            updatedAt: new Date(d.updatedAt),
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/account/saved-designs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDesigns((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return;
    const res = await fetch(`/api/account/saved-designs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renameValue.trim() }),
    });
    if (res.ok) {
      setDesigns((prev) =>
        prev.map((d) => (d.id === id ? { ...d, name: renameValue.trim() } : d))
      );
      setRenamingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-silk rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-silk rounded w-32 mb-3" />
            <div className="h-3 bg-silk rounded w-48" />
          </div>
        ))}
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="bg-white border border-silk rounded-lg p-8 text-center">
        <p className="text-stone text-sm mb-2">No saved designs yet</p>
        <p className="text-stone text-xs">
          Save a design while customising a card to find it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {designs.map((design) => (
        <div key={design.id} className="bg-white border border-silk rounded-lg p-6">
          <div className="flex items-center gap-4">
            {/* Card thumbnail */}
            <div className="w-16 h-20 relative rounded overflow-hidden shrink-0 bg-silk">
              <Image
                src={design.card.images.thumbnail}
                alt={design.card.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              {renamingId === design.id ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    className="px-2 py-1 text-sm border border-silk rounded focus:outline-none focus:ring-2 focus:ring-ink"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(design.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                  />
                  <button
                    onClick={() => handleRename(design.id)}
                    className="text-xs uppercase tracking-wider text-ink hover:underline"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h3 className="font-medium text-ink truncate">{design.name}</h3>
              )}
              <p className="text-xs text-stone">{design.card.title}</p>
              <p className="text-xs text-stone mt-0.5">
                {new Date(design.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col gap-1 shrink-0">
              <Link
                href={`/cards/${design.cardId}/customize?design=${design.id}`}
                className="text-xs uppercase tracking-wider text-ink hover:underline"
              >
                Load
              </Link>
              <button
                onClick={() => {
                  setRenamingId(design.id);
                  setRenameValue(design.name);
                }}
                className="text-xs uppercase tracking-wider text-stone hover:text-ink transition-colors"
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(design.id)}
                className="text-xs uppercase tracking-wider text-red-600 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

