import { styled, css } from 'next-yak'

export const Wrapper = styled.section`
	margin: 2rem 1rem;
`
export const Content = styled.section`
	h2 {
		margin: 0.6rem 0;
	}
`
export const Compass = styled.div`
	position: relative;
	width: 320px;
	height: 320px;
	border-radius: 50%;
	box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
	margin: auto;

	.compass-circle,
	.my-point {
	}

	.my-point {
	}
`

export const Arrow = styled.div`
	position: absolute;
	width: 0;
	height: 0;
	top: -20px;
	left: 50%;
	transform: translateX(-50%);
	border-style: solid;
	border-width: 30px 20px 0 20px;
	border-color: red transparent transparent transparent;
	z-index: 1;
`

interface CircleProps {
	$compass?: number
}

/* Background credits : background: url('https://purepng.com/public/uploads/large/purepng.com-compasscompassinstrumentnavigationcardinal-directionspointsdiagram-1701527842316onq7x.png')
 */
export const Circle = styled.div<CircleProps>`
	position: absolute;
	width: 90%;
	height: 90%;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transition: transform 0.1s ease-out;
	background: url('/can-be-useful/nextjs-compass/boussole.png') center no-repeat;
	background-size: contain;

	${(p) =>
		p.$compass
			? css`
					transform: translate(-50%, -50%) rotate(${-p.$compass}deg) !important;
				`
			: ''}
`

interface PointProps {
	$opacity?: number
}

export const Point = styled.div<PointProps>`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-size: contain;

	opacity: ${(p) => p.$opacity || 0} !important;
	width: 20%;
	height: 20%;
	background: rgb(8, 223, 69);
	border-radius: 50%;
	transition: opacity 0.5s ease-out;
`
