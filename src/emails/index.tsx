import * as React from 'react';
import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
	Tailwind,
} from '@react-email/components';

const WaitlistEmail = ({ userFirstname }: { userFirstname: string }) => {
	const currentYear = new Date().getFullYear();

	return (
		<Html>
			<Tailwind>
				<Head>
					<title>Neurolab Preorder Confirmation</title>
					<Preview>Your Neurolab device preorder has been confirmed! We'll keep you updated on shipping details.</Preview>
					<style>
						{`
              @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700&display=swap');
            `}
					</style>
				</Head>
				<Body className="bg-[#09090B] py-[40px]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
					<Container className="bg-[#18181B] rounded-[8px] mx-auto p-[32px] max-w-[600px]">
						<Section className="mt-[16px] text-center">
							<Text className="text-[28px] font-bold text-white m-0">
								Welcome to <span className="text-[#3B82F6]">Neurolab</span>
							</Text>

							<Text className="text-[18px] text-[#A1A1AA] mt-[16px] mb-[16px]">
								Your device preorder has been confirmed!
							</Text>

							<Hr className="border-solid border-[#27272A] my-[16px] w-[80px] mx-auto" />
						</Section>

						<Section>
							<Text className="text-[16px] leading-[24px] text-white mt-[32px]">
								Hi {userFirstname},
							</Text>

							<Text className="text-[16px] leading-[24px] text-[#E4E4E7]">
								Thank you for preordering your Neurolab device! You're now part of an exclusive group getting early access to the next generation of brain-computer interface technology.
							</Text>

							<Text className="text-[16px] leading-[24px] text-[#E4E4E7]">
								We'll keep you updated throughout the development process and notify you as soon as your device is ready to ship. Expected delivery is early 2026, and you'll receive tracking information when your order ships.
							</Text>

							<Section className="my-[32px] text-center">
								<Button
									className="bg-[#3B82F6] text-white font-bold py-[12px] px-[24px] rounded-[12px] no-underline text-center box-border"
									href="https://neurolab.cc"
								>
									<span style={{ display: 'inline-flex', alignItems: 'center' }}>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											style={{ marginRight: '8px' }}
										>
											<title>Calendar</title>
											<path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M8 14H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M12 14H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M16 14H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M8 18H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M16 18H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										Learn More
									</span>
								</Button>
							</Section>

							<Text className="text-[16px] leading-[24px] text-[#E4E4E7]">
								Stay connected with us at <Link href="https://neurolab.cc" className="text-[#3B82F6] underline">neurolab.cc</Link> for development updates, technical insights, and early previews of your device.
							</Text>

							<Text className="text-[16px] leading-[24px] text-[#E4E4E7] mt-[24px]">
								Cheers,
							</Text>

							<Text className="text-[16px] font-bold text-white mb-[32px]">
								The Neurolab Team
							</Text>
						</Section>

						<Hr className="border-solid border-[#27272A] my-[24px]" />

						<Section>
							<Text className="text-[12px] text-[#71717A] text-center m-0">
								&copy; {currentYear} Neurolab. All rights reserved.
							</Text>
							<Text className="text-[12px] text-[#71717A] text-center m-0">
								Neurolab Technologies, Kigali, Rwanda
							</Text>
							<Text className="text-[12px] text-[#71717A] text-center mt-[16px]">
								<Link href="https://neurolab.cc/unsubscribe" className="text-[#3B82F6]">
									Unsubscribe
								</Link>{' '}
								•{' '}
								<Link href="https://neurolab.cc/privacy" className="text-[#3B82F6]">
									Privacy Policy
								</Link>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default WaitlistEmail;