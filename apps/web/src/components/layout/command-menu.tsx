"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "cmdk";
import { Calculator, Calendar, CreditCard, Settings, Smile, User, Search, ShoppingCart, Home, Package } from "lucide-react";
import { useEffect, useState } from "react";

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        // Note: cmdk requires some global styles or className manipulation. 
        // We'll wrap it in a div that we can style in global.css if needed, 
        // or use Tailwind classes directly on the primitive if feasible.
        // For now, using a standard styled Command Palette structure.
        <CommandDialog open={open} onOpenChange={setOpen} label="Global Command Menu">
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <CommandInput
                            placeholder="Type a command or search..."
                            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                    <CommandList className="max-h-[300px] overflow-y-auto p-2">
                        <CommandEmpty className="py-6 text-center text-sm">No results found.</CommandEmpty>

                        <CommandGroup heading="Navigation" className="text-xs font-medium text-slate-500 px-2 py-1.5">
                            <CommandItem onSelect={() => runCommand(() => router.push("/"))} className="flex items-center px-2 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                                <Home className="mr-2 h-4 w-4" />
                                <span>Home</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/cart"))} className="flex items-center px-2 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                <span>Cart</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/account"))} className="flex items-center px-2 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/vendor/dashboard"))} className="flex items-center px-2 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                                <Package className="mr-2 h-4 w-4" />
                                <span>Vendor Dashboard</span>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator className="my-1 h-px bg-slate-200 dark:bg-slate-800" />

                        <CommandGroup heading="Settings" className="text-xs font-medium text-slate-500 px-2 py-1.5">
                            <CommandItem onSelect={() => runCommand(() => router.push("/account/settings"))} className="flex items-center px-2 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </div>
            </div>
        </CommandDialog>
    );
}
