"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Search, Loader2, Phone, IndianRupee, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contentApi } from "@/lib/api-services";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { formatDistanceToNow } from "date-fns";

const categories = ["Livestock", "Crops", "Handicrafts", "Equipment", "Other"];

export default function MarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPostOpen, setIsPostOpen] = useState(false);
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await contentApi.getMarketplaceItems(selectedCategory, search);
      setItems(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch marketplace items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchItems();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, selectedCategory]);

  const onSubmitPost = async (data: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to post an item.");
      return;
    }
    setIsSubmitting(true);
    try {
      await contentApi.createMarketplaceItem(data);
      toast.success("Item listed successfully!");
      setIsPostOpen(false);
      reset();
      fetchItems();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to list item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Village Marketplace (Kisan Mandi)"
        subtitle="Buy and sell livestock, crops, handicrafts, and farming equipment locally."
        badge="Marketplace"
      />
      
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex-1 w-full max-w-2xl flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items or sellers..."
                  className="pl-9 bg-background/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white">
                  <Tag className="mr-2 h-4 w-4" />
                  Sell an Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-strong border-white/20">
                <DialogHeader>
                  <DialogTitle>List an Item for Sale</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitPost)} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Item Name *</Label>
                    <Input {...register("itemName", { required: true })} placeholder="e.g. 5 Desi Cows, 10kg Wheat" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <select 
                        {...register("category", { required: true })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price *</Label>
                      <Input {...register("price", { required: true })} placeholder="e.g. ₹5,000 or ₹20/kg" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Seller Name *</Label>
                      <Input {...register("sellerName", { required: true })} placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone *</Label>
                      <Input {...register("contactPhone", { required: true })} placeholder="10-digit number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea {...register("description", { required: true })} placeholder="Provide details about the item's condition, quantity, etc." />
                  </div>
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "List Item"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-white/20">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No items found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or category.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <Card key={item._id} className="glass group overflow-hidden border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col h-full">
                  <div className="h-32 bg-muted flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for images. Backend supports an array of strings, but UI is simple for now. */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/20" />
                    <Store className="h-12 w-12 text-muted-foreground/30 relative z-10" />
                    <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur text-foreground border-transparent z-10">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-amber-500 transition-colors">
                      {item.itemName}
                    </h3>
                    <p className="text-xl font-bold text-amber-500 mb-2">
                      {item.price}
                    </p>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {item.description}
                    </p>
                    
                    <div className="space-y-2 mt-auto pt-3 border-t border-white/10 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Seller:</span>
                        <span className="font-medium text-foreground">{item.sellerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Posted:</span>
                        <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <a href={`tel:${item.contactPhone}`} className="block w-full mt-4">
                      <Button className="w-full gap-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white border border-amber-500/20" variant="outline">
                        <Phone className="h-4 w-4" />
                        Contact Seller
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
