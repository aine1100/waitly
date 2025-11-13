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

interface WaitlistEmailProps {
	userFirstname: string;
	orderId: string;
	deviceQuantity: number;
	amountPaid: number;
	customerEmail: string;
	orderDate?: string;
}

const WaitlistEmail = ({ 
	userFirstname,
	orderId,
	deviceQuantity,
	amountPaid,
	customerEmail,
	orderDate = new Date().toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	})
}: WaitlistEmailProps) => {
	const currentYear = new Date().getFullYear();

	return (
		<Html>
			<Tailwind>
				<Head>
					<title>Neurolab Preorder Confirmation</title>
					<Preview>Your Neurolab device preorder has been confirmed! Order #{orderId.slice(-8)}</Preview>
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

							{/* Order Details Section */}
							<Section className="bg-[#27272A] rounded-[8px] p-[24px] my-[32px]">
								<Text className="text-[18px] font-bold text-white m-0 mb-[16px]">
									Order Details
								</Text>
								
								<table width="100%" style={{ borderCollapse: 'collapse' }}>
									<tbody>
										<tr>
											<td style={{ padding: '8px 0' }}>
												<Text className="text-[14px] text-[#A1A1AA] m-0">Order ID:</Text>
											</td>
											<td style={{ padding: '8px 0', textAlign: 'right' }}>
												<Text className="text-[14px] text-white font-mono m-0">
													{orderId}
												</Text>
											</td>
										</tr>
										<tr>
											<td style={{ padding: '8px 0' }}>
												<Text className="text-[14px] text-[#A1A1AA] m-0">Order Date:</Text>
											</td>
											<td style={{ padding: '8px 0', textAlign: 'right' }}>
												<Text className="text-[14px] text-white m-0">{orderDate}</Text>
											</td>
										</tr>
										<tr>
											<td style={{ padding: '8px 0' }}>
												<Text className="text-[14px] text-[#A1A1AA] m-0">Email:</Text>
											</td>
											<td style={{ padding: '8px 0', textAlign: 'right' }}>
												<Text className="text-[14px] text-white m-0">{customerEmail}</Text>
											</td>
										</tr>
										<tr>
											<td style={{ padding: '12px 0 8px 0', borderTop: '1px solid #3F3F46' }}>
												<Text className="text-[14px] text-[#A1A1AA] m-0">Device Quantity:</Text>
											</td>
											<td style={{ padding: '12px 0 8px 0', textAlign: 'right', borderTop: '1px solid #3F3F46' }}>
												<Text className="text-[14px] text-white font-bold m-0">
													{deviceQuantity} {deviceQuantity === 1 ? 'Device' : 'Devices'}
												</Text>
											</td>
										</tr>
										<tr>
											<td style={{ padding: '8px 0' }}>
												<Text className="text-[16px] font-bold text-white m-0">Total Paid:</Text>
											</td>
											<td style={{ padding: '8px 0', textAlign: 'right' }}>
												<Text className="text-[20px] font-bold text-[#3B82F6] m-0">
													${(amountPaid / 100).toFixed(2)}
												</Text>
											</td>
										</tr>
									</tbody>
								</table>
							</Section>

							<Text className="text-[16px] leading-[24px] text-[#E4E4E7]">
								We'll keep you updated throughout the development process and notify you as soon as your device is ready to ship. Expected delivery is early 2026, and you'll receive tracking information when your order ships.
							</Text>

							<Section className="my-[32px] text-center">
								<Button
									className="bg-[#3B82F6] text-white font-bold py-[12px] px-[24px] rounded-[12px] no-underline text-center box-border"
									href={`https://waitlist.neurolab.cc`}
								>
									<span style={{ display: 'inline-flex', alignItems: 'center' }}>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											style={{ marginRight: '8px' }}
										>
											<title>View Order</title>
											<path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										View Order Status
									</span>
								</Button>
							</Section>

							<Text className="text-[16px] leading-[24px] text-[#E4E4E7]">
								Stay connected with us at <Link href="https://neurolab.cc" className="text-[#3B82F6] underline">neurolab.cc</Link> for development updates, technical insights, and early previews of your device.
							</Text>

							<Section className="bg-[#18181B] border border-[#27272A] rounded-[8px] p-[16px] my-[24px]">
								<Text className="text-[14px] text-[#A1A1AA] m-0">
									💡 <span className="font-bold text-white">Need help?</span> Contact us at{' '}
									<Link href="mailto:info@neurolab.cc" className="text-[#3B82F6]">
										info@neurolab.cc
									</Link>{' '}
									with your order ID for assistance.
								</Text>
							</Section>

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