import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import React from "react";

type DynamicInputListProps = {
  label: string;
  values: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholderPrefix: string;
};

export function DynamicInputList({
  label,
  values,
  onChange,
  onAdd,
  onRemove,
  placeholderPrefix,
}: DynamicInputListProps) {
  return (
    <div>
      <label className="text-blue-300 font-medium mb-3 block">{label}</label>
      <div className="space-y-3">
        <AnimatePresence>
          {values.map((val, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-3"
            >
              <Input
                value={val}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`${placeholderPrefix} ${index + 1}`}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
              {values.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="border-red-500 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={onAdd}
          className="w-full py-3 border-2 border-dashed border-blue-500/30 text-blue-400 hover:border-blue-500/50 hover:text-blue-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-4 w-4" />
          Add {placeholderPrefix}
        </motion.button>
      </div>
    </div>
  );
} 