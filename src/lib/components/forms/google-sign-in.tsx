"use client";

import google from "#/assets/google.svg";
import { signInWithGoogle } from "#/lib/actions/sign-in-with-google";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, type PropsWithChildren } from "react";
import { useAsyncFn } from "react-use";

export const GoogleSignIn = ({
	next,
	children,
}: PropsWithChildren<{ next?: string }>) => {
	const router = useRouter();
	const redirectTo = useMemo(() => {
		if (typeof window !== "undefined") {
			const url = new URL("/auth/callback", window.location.href);
			if (next) {
				url.searchParams.set("next", next);
			}

			return url.toString();
		}
	}, [next]);

	const [{ loading }, onClick] = useAsyncFn(async () => {
		const href = await signInWithGoogle(redirectTo);
		router.push(href);
	});

	return (
		<Button
			className="flex w-full justify-center gap-x-3 rounded-lg border border-[#313131] bg-neutral-800 p-2.5 hover:bg-[#313131] motion-safe:transition-colors"
			onClick={onClick}
		>
			{loading ? (
				<FontAwesomeIcon
					className="animate-spin"
					icon={faSpinner}
					width={20}
					height={20}
				/>
			) : (
				<>
					<Image src={google} alt="Google" width={20} height={20} />
					<span className="text-sm font-medium text-white">{children}</span>
				</>
			)}
		</Button>
	);
};
