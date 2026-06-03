
"use client";

import { useState, useEffect } from 'react';
import { MovementType } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveMovement } from '@/lib/db';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { categorizeTransactionAndSuggestSavings } from '@/ai/flows/ai-transaction-categorization-and-savings-suggestions';

interface Props {
  type: MovementType | null;
  onClose: () => void;
}

export function MovementDialog({ type, onClose }: Props) {
  const db = useFirestore();
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (type) {
      setValue('');
      setDescription('');
      setObservation('');
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !value || !description || !db) return;

    setIsSubmitting(true);
    
    const normalizedValue = value.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);

    if (isNaN(numericValue)) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "Por favor, insira um número válido.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let aiData = null;
      
      if (type === 'DESPESAS' || type === 'WITHDRAWAL') {
        try {
          aiData = await categorizeTransactionAndSuggestSavings({ description });
        } catch (aiError) {
          console.warn("IA indisponível no momento, registrando sem insights.");
        }
      }

      saveMovement(db, {
        type,
        value: numericValue,
        description,
        observation,
        aiCategory: aiData?.category,
        aiSuggestions: aiData?.suggestions,
      });

      toast({
        title: "Sucesso!",
        description: "Movimentação registrada com sucesso.",
        className: "bg-accent text-accent-foreground",
      });
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível registrar a movimentação.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-white">
            Registrar {type === 'DESPESAS' ? 'Despesa' : type === 'WITHDRAWAL' ? 'Sangria' : type}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="value" className="text-muted-foreground">Valor (R$)</Label>
            <Input
              id="value"
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-2xl h-14 bg-background border-muted focus-visible:ring-primary font-bold text-accent"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Coca-cola 2L ou Aluguel"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-muted"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="observation" className="text-muted-foreground">Observação (Opcional)</Label>
            <Textarea
              id="observation"
              placeholder="Detalhes adicionais..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="bg-background border-muted resize-none"
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Movimentação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
