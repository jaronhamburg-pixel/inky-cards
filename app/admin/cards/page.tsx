'use client';

import { useState, useMemo, useCallback } from 'react';
import { getAllCards, addCard, updateCard, deleteCard } from '@/lib/data/mock-cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatPrice } from '@/lib/utils/formatting';
import type { Card, CardCategory } from '@/types/card';

const CATEGORIES: CardCategory[] = [
  'birthday',
  'anniversary',
  'wedding',
  'congratulations',
  'new-baby',
  'new-home',
  'new-job',
  'good-luck',
  'get-well-soon',
  'thinking-of-you',
  'for-you',
  'misc',
];

const CATEGORY_LABELS: Record<CardCategory, string> = {
  anniversary: 'Anniversary',
  birthday: 'Birthday',
  congratulations: 'Congratulations',
  'for-you': 'For You',
  'get-well-soon': 'Get Well Soon',
  'good-luck': 'Good Luck',
  misc: 'Misc',
  'new-baby': 'New Baby',
  'new-home': 'New Home',
  'new-job': 'New Job',
  'thinking-of-you': 'Thinking of You',
  wedding: 'Wedding',
};

interface CardFormData {
  title: string;
  description: string;
  category: CardCategory;
  price: number;
  frontImage: string;
  backImage: string;
  thumbnailImage: string;
  frontTextCustomizable: boolean;
  insideTextCustomizable: boolean;
}

const EMPTY_FORM: CardFormData = {
  title: '',
  description: '',
  category: 'birthday',
  price: 0,
  frontImage: '',
  backImage: '',
  thumbnailImage: '',
  frontTextCustomizable: false,
  insideTextCustomizable: false,
};

function formDataToCard(form: CardFormData): Omit<Card, 'id'> {
  return {
    title: form.title,
    description: form.description,
    category: form.category,
    price: form.price,
    images: {
      front: form.frontImage,
      back: form.backImage,
      thumbnail: form.thumbnailImage,
    },
    customizable: {
      frontText: form.frontTextCustomizable,
      backText: false,
      insideText: form.insideTextCustomizable,
    },
    templates: {},
  };
}

function cardToFormData(card: Card): CardFormData {
  return {
    title: card.title,
    description: card.description,
    category: card.category,
    price: card.price,
    frontImage: card.images.front,
    backImage: card.images.back,
    thumbnailImage: card.images.thumbnail,
    frontTextCustomizable: card.customizable.frontText,
    insideTextCustomizable: card.customizable.insideText,
  };
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<Card[]>(() => getAllCards());
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState<CardFormData>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery.toLowerCase();
    return cards.filter(
      (card) =>
        card.title.toLowerCase().includes(query) ||
        card.category.toLowerCase().includes(query)
    );
  }, [cards, searchQuery]);

  const refreshCards = useCallback(() => {
    setCards(getAllCards());
  }, []);

  const openAddModal = useCallback(() => {
    setEditingCard(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((card: Card) => {
    setEditingCard(card);
    setFormData(cardToFormData(card));
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCard(null);
    setFormData(EMPTY_FORM);
  }, []);

  const handleFormSubmit = useCallback(() => {
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (editingCard) {
      updateCard(editingCard.id, formDataToCard(formData));
    } else {
      addCard(formDataToCard(formData));
    }
    refreshCards();
    closeModal();
  }, [formData, editingCard, refreshCards, closeModal]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteCard(id);
      refreshCards();
      setDeleteConfirmId(null);
    },
    [refreshCards]
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-display text-luxury-charcoal text-3xl mb-2">
            Card Management
          </h1>
          <p className="text-neutral-500 text-sm">
            Manage your Inky Cards collection. Add, edit, or remove cards from the catalog.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search cards by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white"
            />
          </div>
          <Button variant="secondary" onClick={openAddModal}>
            <span className="mr-2">+</span>
            Add New Card
          </Button>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-neutral-500">
          Showing {filteredCards.length} of {cards.length} cards
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                      {searchQuery
                        ? 'No cards match your search criteria.'
                        : 'No cards found. Add your first card to get started.'}
                    </td>
                  </tr>
                ) : (
                  filteredCards.map((card) => (
                    <tr
                      key={card.id}
                      className="hover:bg-neutral-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded bg-neutral-200 bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url(${card.images.thumbnail})` }}
                          />
                          <div>
                            <div className="font-medium text-luxury-charcoal text-sm">
                              {card.title}
                            </div>
                            <div className="text-xs text-neutral-400 mt-0.5 max-w-[200px] truncate">
                              {card.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default">
                          {CATEGORY_LABELS[card.category]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-luxury-charcoal">
                          {formatPrice(card.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(card)}
                          >
                            Edit
                          </Button>
                          {deleteConfirmId === card.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(card.id)}
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirmId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirmId(card.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingCard ? 'Edit Card' : 'Add New Card'}
          size="lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
            className="space-y-6"
          >
            {/* Title */}
            <Input
              label="Title"
              required
              placeholder="Enter card title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            {/* Description */}
            <div className="w-full">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Description<span className="text-red-600 ml-1">*</span>
              </label>
              <textarea
                required
                placeholder="Enter card description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent placeholder:text-neutral-400 transition-all duration-200 resize-vertical"
              />
            </div>

            {/* Category & Price row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Category<span className="text-red-600 ml-1">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as CardCategory,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-200 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Price"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            {/* Image URLs */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-luxury-charcoal uppercase tracking-wider">
                Images
              </h3>
              <Input
                label="Front Image URL"
                placeholder="https://..."
                value={formData.frontImage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, frontImage: e.target.value }))
                }
              />
              <Input
                label="Back Image URL"
                placeholder="https://..."
                value={formData.backImage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, backImage: e.target.value }))
                }
              />
              <Input
                label="Thumbnail URL"
                placeholder="https://..."
                value={formData.thumbnailImage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    thumbnailImage: e.target.value,
                  }))
                }
              />
            </div>

            {/* Customizable options */}
            <div>
              <h3 className="text-sm font-semibold text-luxury-charcoal uppercase tracking-wider mb-2">
                Customization
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.frontTextCustomizable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        frontTextCustomizable: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold"
                  />
                  <span className="text-sm text-neutral-700">
                    Front text customizable
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.insideTextCustomizable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        insideTextCustomizable: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-neutral-300 text-luxury-gold focus:ring-luxury-gold"
                  />
                  <span className="text-sm text-neutral-700">
                    Inside text customizable
                  </span>
                </label>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200" />

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary">
                {editingCard ? 'Save Changes' : 'Add Card'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
