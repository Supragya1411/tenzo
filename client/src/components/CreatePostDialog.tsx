import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema, type InsertPost } from "@shared/schema";
import { useCreatePost } from "@/hooks/use-posts";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createPost = useCreatePost();

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      category: "Lifestyle",
      imageUrl: "",
      content: "",
    },
  });

  const onSubmit = (data: InsertPost) => {
    createPost.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Entry Published",
          description: "Your journal entry has been successfully created.",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg bg-accent hover:bg-accent/90 text-white border-none">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-[#F2F0EB] border-white/20">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">New Journal Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Morning Reflections..."
              className="bg-white/50 border-transparent focus:border-primary/20"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Lifestyle"
                className="bg-white/50 border-transparent focus:border-primary/20"
                {...form.register("category")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Unsplash)</Label>
              <Input
                id="imageUrl"
                placeholder="https://images.unsplash.com/..."
                className="bg-white/50 border-transparent focus:border-primary/20"
                {...form.register("imageUrl")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Short Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="A brief summary for the card view..."
              className="bg-white/50 border-transparent focus:border-primary/20 h-20 resize-none"
              {...form.register("excerpt")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Full Content</Label>
            <Textarea
              id="content"
              placeholder="Write your thoughts here..."
              className="bg-white/50 border-transparent focus:border-primary/20 h-32"
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={createPost.isPending}
              className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white"
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Entry"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
