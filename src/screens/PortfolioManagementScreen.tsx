import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  Grid3X3,
  List,
  Folder,
  Star,
  Trash2,
  Edit3,

  ChevronUp,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';
import { Button, Modal } from '../components';
import { mockCreators } from '../data/mock';
import { cn } from '../utils/helpers';
import type { PortfolioItem, EquipmentTag, StyleTag } from '../types';

interface PortfolioItemExtended extends PortfolioItem {
  isHighlight?: boolean;
}

const equipmentOptions: EquipmentTag[] = ['drone', '4k', 'gimbal', 'lighting', 'underwater', '360', 'dslr'];
const styleOptions: StyleTag[] = ['hotelaria', 'lifestyle', 'arquitetura', 'gastronomia', 'natureza', 'aereo'];

export function PortfolioManagementScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const creator = mockCreators[0];

  const [items, setItems] = useState<PortfolioItemExtended[]>(
    creator.portfolio.map(p => ({ ...p, isHighlight: false }))
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItemExtended | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // New item form
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemFolder, setNewItemFolder] = useState('');
  const [newItemImages, setNewItemImages] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentTag[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>([]);

  const folders = Array.from(new Set(items.map(item => item.folder)));

  const filteredItems = selectedFolder === 'all'
    ? items
    : items.filter(item => item.folder === selectedFolder);

  const highlightItems = items.filter(item => item.isHighlight);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddItem = () => {
    if (!newItemTitle || newItemImages.length === 0) return;

    const newItem: PortfolioItemExtended = {
      id: `portfolio-${Date.now()}`,
      title: newItemTitle,
      description: newItemDescription,
      images: newItemImages,
      folder: newItemFolder || 'Geral',
      tags: [...selectedEquipment, ...selectedStyles],
      createdAt: new Date(),
      isHighlight: false,
    };

    setItems(prev => [newItem, ...prev]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEditItem = () => {
    if (!editingItem || !newItemTitle) return;

    setItems(prev => prev.map(item =>
      item.id === editingItem.id
        ? {
          ...item,
          title: newItemTitle,
          description: newItemDescription,
          folder: newItemFolder || item.folder,
          tags: [...selectedEquipment, ...selectedStyles],
        }
        : item
    ));
    resetForm();
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setShowDeleteConfirm(null);
  };

  const toggleHighlight = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, isHighlight: !item.isHighlight } : item
    ));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newItems.length) return;

    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
  };

  const resetForm = () => {
    setNewItemTitle('');
    setNewItemDescription('');
    setNewItemFolder('');
    setNewItemImages([]);
    setSelectedEquipment([]);
    setSelectedStyles([]);
  };

  const openEditModal = (item: PortfolioItemExtended) => {
    setEditingItem(item);
    setNewItemTitle(item.title);
    setNewItemDescription(item.description || '');
    setNewItemFolder(item.folder);
    setSelectedEquipment(item.tags.filter(t => equipmentOptions.includes(t as EquipmentTag)) as EquipmentTag[]);
    setSelectedStyles(item.tags.filter(t => styleOptions.includes(t as StyleTag)) as StyleTag[]);
    setShowEditModal(true);
  };

  const toggleEquipment = (item: EquipmentTag) => {
    setSelectedEquipment(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const toggleStyle = (style: StyleTag) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  return (
    <div className="min-h-screen bg-porcelain pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-warm-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink">Meu Portfólio</h1>
            <p className="text-sm text-warm-gray-500">{items.length} projetos</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2.5 bg-coral text-white rounded-xl hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Highlights Section */}
      {highlightItems.length > 0 && (
        <div className="px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-sm font-medium text-warm-gray-500 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Destaques do perfil
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {highlightItems.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-40"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-warm-gray-100">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-ink mt-2 truncate">{item.title}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Folder Filter */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <button
            onClick={() => setSelectedFolder('all')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedFolder === 'all'
                ? 'bg-coral text-white'
                : 'bg-white text-warm-gray-600 hover:bg-warm-gray-100'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
            Todos
          </button>
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                selectedFolder === folder
                  ? 'bg-coral text-white'
                  : 'bg-white text-warm-gray-600 hover:bg-warm-gray-100'
              )}
            >
              <Folder className="w-4 h-4" />
              {folder}
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <p className="text-sm text-warm-gray-500">
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
        </p>
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-warm-gray-200">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid' ? 'bg-coral text-white' : 'text-warm-gray-600'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'list' ? 'bg-coral text-white' : 'text-warm-gray-600'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Portfolio Items */}
      <div className="px-4 mt-4 pb-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-warm-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-10 h-10 text-warm-gray-400" />
            </div>
            <p className="text-ink font-medium mb-2">Nenhum item no portfólio</p>
            <p className="text-sm text-warm-gray-500 mb-4">
              Adicione seus melhores trabalhos para mostrar aos hotéis
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Adicionar projeto
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-warm-gray-100">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {item.images.length > 1 && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                      +{item.images.length - 1}
                    </div>
                  )}
                  <button
                    onClick={() => toggleHighlight(item.id)}
                    className={cn(
                      'absolute top-2 left-2 p-2 rounded-full transition-colors',
                      item.isHighlight
                        ? 'bg-yellow-400 text-white'
                        : 'bg-black/30 text-white hover:bg-black/50'
                    )}
                  >
                    <Star className="w-4 h-4" fill={item.isHighlight ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="font-medium text-ink text-sm truncate">{item.title}</p>
                  <p className="text-xs text-warm-gray-500">{item.folder}</p>
                </div>
                <div className="absolute bottom-14 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-warm-gray-50"
                  >
                    <Edit3 className="w-4 h-4 text-warm-gray-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-warm-gray-100 flex-shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-ink truncate">{item.title}</h3>
                    {item.isHighlight && (
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" />
                    )}
                  </div>
                  <p className="text-sm text-warm-gray-500">{item.folder}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-warm-gray-100 rounded-lg disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-1.5 hover:bg-warm-gray-100 rounded-lg disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => toggleHighlight(item.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      item.isHighlight ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-warm-gray-100'
                    )}
                  >
                    <Star className="w-4 h-4" fill={item.isHighlight ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 hover:bg-warm-gray-100 rounded-lg"
                  >
                    <Edit3 className="w-4 h-4 text-warm-gray-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Adicionar projeto"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Imagens *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-warm-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-coral hover:bg-coral/5 transition-colors"
            >
              <Upload className="w-8 h-8 text-coral mx-auto mb-2" />
              <p className="text-sm text-warm-gray-600">
                Clique para adicionar imagens
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {newItemImages.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {newItemImages.map((img, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => setNewItemImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Nome do projeto"
              className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Descrição
            </label>
            <textarea
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="Descreva o projeto..."
              rows={3}
              className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Folder */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Pasta/Coleção
            </label>
            <input
              type="text"
              value={newItemFolder}
              onChange={(e) => setNewItemFolder(e.target.value)}
              placeholder="Ex: Hotelaria, Drone, Lifestyle"
              className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none"
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Equipamentos usados
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((eq) => (
                <button
                  key={eq}
                  onClick={() => toggleEquipment(eq)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm transition-colors',
                    selectedEquipment.includes(eq)
                      ? 'bg-coral text-white'
                      : 'bg-warm-gray-100 text-warm-gray-600'
                  )}
                >
                  {eq.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Styles */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Estilos
            </label>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm capitalize transition-colors',
                    selectedStyles.includes(style)
                      ? 'bg-sunshine text-ink'
                      : 'bg-warm-gray-100 text-warm-gray-600'
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddItem}
              disabled={!newItemTitle || newItemImages.length === 0}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
          resetForm();
        }}
        title="Editar projeto"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Título
            </label>
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Descrição
            </label>
            <textarea
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Folder */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Pasta/Coleção
            </label>
            <input
              type="text"
              value={newItemFolder}
              onChange={(e) => setNewItemFolder(e.target.value)}
              className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none"
            />
          </div>

          {/* Equipment & Styles */}
          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Equipamentos
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((eq) => (
                <button
                  key={eq}
                  onClick={() => toggleEquipment(eq)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm transition-colors',
                    selectedEquipment.includes(eq)
                      ? 'bg-coral text-white'
                      : 'bg-warm-gray-100 text-warm-gray-600'
                  )}
                >
                  {eq.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-gray-600 mb-2">
              Estilos
            </label>
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm capitalize transition-colors',
                    selectedStyles.includes(style)
                      ? 'bg-sunshine text-ink'
                      : 'bg-warm-gray-100 text-warm-gray-600'
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowEditModal(false);
                setEditingItem(null);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleEditItem}
              disabled={!newItemTitle}
            >
              Salvar
            </Button>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => {
              setShowEditModal(false);
              if (editingItem) setShowDeleteConfirm(editingItem.id);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-4"
          >
            <Trash2 className="w-5 h-5" />
            Excluir projeto
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Excluir projeto?"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-warm-gray-600 mb-6">
            Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={() => showDeleteConfirm && handleDeleteItem(showDeleteConfirm)}
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
