import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePuzzles } from '@/hooks/usePuzzles';
import type { Puzzle } from '@/hooks/puzzles/puzzleTypes';

export const DEFAULT_NEW_PUZZLE: Partial<Puzzle> = {
  name: "New Puzzle",
  category: "",
  category_id: "",
  difficulty: "medium",
  imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop",
  timeLimit: 300,
  costPerPlay: 1.99,
  targetRevenue: 199.99,
  status: "draft",
  prize: "New Prize",
  completions: 0,
  avgTime: 0,
  prizeValue: 99.99,
  description: "",
  supplier: "",
  puzzleOwner: ""
};

export function usePuzzleManagement() {
  const { puzzles, isLoading, isError, createPuzzle, updatePuzzle, deletePuzzle, checkPuzzleTableExists } = usePuzzles();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPuzzle, setEditPuzzle] = useState<Partial<Puzzle> | null>(null);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [newPuzzleDialogOpen, setNewPuzzleDialogOpen] = useState(false);
  const [newPuzzle, setNewPuzzle] = useState<Partial<Puzzle>>(DEFAULT_NEW_PUZZLE);

  useEffect(() => {
    const checkTable = async () => {
      const exists = await checkPuzzleTableExists();
      setTableExists(exists);
    };
    checkTable();
  }, [checkPuzzleTableExists]);

  const handleNewPuzzleChange = (field: string, value: any) => {
    console.log("Changing new puzzle field:", field, "to value:", value);
    setNewPuzzle(prev => ({ ...prev, [field]: value }));
  };

  const saveNewPuzzle = () => {
    if (newPuzzle) {
      console.log("Saving new puzzle:", newPuzzle);
      createPuzzle(newPuzzle);
      setNewPuzzleDialogOpen(false);
      toast({
        title: "Puzzle Created",
        description: "New puzzle has been created successfully"
      });
    }
  };

  const handleEditChange = (field: string, value: any) => {
    console.log("Editing puzzle field:", field, "to value:", value);
    setEditPuzzle(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const startEdit = (puzzle: Puzzle) => {
    setEditingId(puzzle.id);
    setEditPuzzle({ ...puzzle });
  };

  const saveEdit = () => {
    if (editPuzzle) {
      console.log("Saving edited puzzle:", editPuzzle);
      updatePuzzle(editPuzzle);
      setEditingId(null);
      setEditPuzzle(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPuzzle(null);
  };

  const handleToggleStatus = (puzzle: Puzzle) => {
    const updatedStatus = puzzle.status === 'active' ? 'draft' : 'active';
    updatePuzzle({ ...puzzle, status: updatedStatus });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (editingId) {
          setEditPuzzle(prev => prev ? ({ ...prev, imageUrl }) : null);
        } else {
          setNewPuzzle(prev => ({ ...prev, imageUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPuzzles = puzzles.filter(puzzle => 
    puzzle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.prize?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    puzzles: filteredPuzzles,
    isLoading,
    isError,
    tableExists,
    searchTerm,
    setSearchTerm,
    editingId,
    editPuzzle,
    newPuzzleDialogOpen,
    setNewPuzzleDialogOpen,
    newPuzzle,
    setNewPuzzle,
    handleNewPuzzleChange,
    saveNewPuzzle,
    handleEditChange,
    startEdit,
    saveEdit,
    cancelEdit,
    handleToggleStatus,
    handleImageUpload,
    deletePuzzle,
  };
}
