'use client';

import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { EyeOff } from 'lucide-react'; // Icon import

const NavBar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="w-full bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo with icon */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800 hover:text-black">
                    <EyeOff size={20} className="text-gray-700" />
                    Anonimo
                </Link>

                {/* User Section */}
                {session ? (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 text-sm text-right">
                            Welcome, <strong>{user?.username || user?.email}</strong>
                        </span>
                        <Button variant="outline" onClick={() => signOut()}>
                            Log out
                        </Button>
                    </div>
                ) : (
                    <Link href="/signin">
                        <Button>Log in</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
