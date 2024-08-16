"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./ToggleMode";

import { FC } from "react";

export const Header: FC = () => {
    return (
        <div className="flex justify-between items-cente p-4 h-[70px]">
            <div>

            </div>
            <div className="flex justify-center gap-4 items-center">
                <ModeToggle />
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    )
}