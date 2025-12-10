'use client'

import { useState } from 'react'
import { Palette, Type, Save, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface BrandEditorProps {
  brandSystem: {
    primaryColors: string[]
    secondaryColors: string[]
    primaryFont: string
    secondaryFont: string
  }
  onUpdate: (updates: {
    primaryColors?: string[]
    secondaryColors?: string[]
    primaryFont?: string
    secondaryFont?: string
  }) => void
}

export default function BrandEditor({ brandSystem, onUpdate }: BrandEditorProps) {
  const [editingColors, setEditingColors] = useState(false)
  const [editingFonts, setEditingFonts] = useState(false)
  const [tempPrimaryColors, setTempPrimaryColors] = useState(brandSystem.primaryColors)
  const [tempSecondaryColors, setTempSecondaryColors] = useState(brandSystem.secondaryColors)
  const [tempPrimaryFont, setTempPrimaryFont] = useState(brandSystem.primaryFont)
  const [tempSecondaryFont, setTempSecondaryFont] = useState(brandSystem.secondaryFont)

  const handleSaveColors = () => {
    onUpdate({
      primaryColors: tempPrimaryColors,
      secondaryColors: tempSecondaryColors,
    })
    setEditingColors(false)
  }

  const handleSaveFonts = () => {
    onUpdate({
      primaryFont: tempPrimaryFont,
      secondaryFont: tempSecondaryFont,
    })
    setEditingFonts(false)
  }

  const addColor = (isPrimary: boolean) => {
    const newColor = '#000000'
    if (isPrimary) {
      setTempPrimaryColors([...tempPrimaryColors, newColor])
    } else {
      setTempSecondaryColors([...tempSecondaryColors, newColor])
    }
  }

  const updateColor = (index: number, color: string, isPrimary: boolean) => {
    if (isPrimary) {
      const updated = [...tempPrimaryColors]
      updated[index] = color
      setTempPrimaryColors(updated)
    } else {
      const updated = [...tempSecondaryColors]
      updated[index] = color
      setTempSecondaryColors(updated)
    }
  }

  const removeColor = (index: number, isPrimary: boolean) => {
    if (isPrimary) {
      setTempPrimaryColors(tempPrimaryColors.filter((_, i) => i !== index))
    } else {
      setTempSecondaryColors(tempSecondaryColors.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-6">
      {/* Colors Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Brand Colors</h3>
          </div>
          {!editingColors ? (
            <button
              onClick={() => setEditingColors(true)}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveColors}
                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setTempPrimaryColors(brandSystem.primaryColors)
                  setTempSecondaryColors(brandSystem.secondaryColors)
                  setEditingColors(false)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Primary Colors</label>
            <div className="space-y-2">
              {tempPrimaryColors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value, true)}
                    disabled={!editingColors}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value, true)}
                    disabled={!editingColors}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono disabled:bg-gray-50"
                  />
                  {editingColors && (
                    <button
                      onClick={() => removeColor(index, true)}
                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {editingColors && (
                <button
                  onClick={() => addColor(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-purple-600 border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  + Add Color
                </button>
              )}
            </div>
          </div>

          {/* Secondary Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Secondary Colors</label>
            <div className="space-y-2">
              {tempSecondaryColors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value, false)}
                    disabled={!editingColors}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value, false)}
                    disabled={!editingColors}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono disabled:bg-gray-50"
                  />
                  {editingColors && (
                    <button
                      onClick={() => removeColor(index, false)}
                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {editingColors && (
                <button
                  onClick={() => addColor(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-purple-600 border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  + Add Color
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fonts Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Typography</h3>
          </div>
          {!editingFonts ? (
            <button
              onClick={() => setEditingFonts(true)}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveFonts}
                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setTempPrimaryFont(brandSystem.primaryFont)
                  setTempSecondaryFont(brandSystem.secondaryFont)
                  setEditingFonts(false)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Font</label>
            <input
              type="text"
              value={tempPrimaryFont}
              onChange={(e) => setTempPrimaryFont(e.target.value)}
              disabled={!editingFonts}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50"
              placeholder="e.g., Inter, Roboto, Poppins"
            />
            {editingFonts && (
              <p className="text-xs text-gray-500 mt-1">Enter font name (Google Fonts supported)</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Font</label>
            <input
              type="text"
              value={tempSecondaryFont}
              onChange={(e) => setTempSecondaryFont(e.target.value)}
              disabled={!editingFonts}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50"
              placeholder="e.g., Inter, Roboto, Poppins"
            />
            {editingFonts && (
              <p className="text-xs text-gray-500 mt-1">Enter font name (Google Fonts supported)</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

