import type { SVGProps } from "react";

function Logo(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="344"
			height="41"
			viewBox="0 0 344 41"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Media Impact Monitor Logo"
			{...props}
		>
			<rect
				x="0.75"
				y="0.75"
				width="39"
				height="39"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M40.5 0H0V40.5H40.5V0ZM20.478 25.17L24.39 11.85H30.726V28.65H26.886V18.066C26.886 17.202 26.958 16.29 27.102 15.33H26.622L22.71 28.65H17.766L13.854 15.33H13.374C13.438 15.73 13.486 16.178 13.518 16.674C13.566 17.154 13.59 17.618 13.59 18.066V28.65H9.74999V11.85H16.086L19.998 25.17H20.478ZM22.113 13.725C22.113 14.7605 21.2735 15.6 20.238 15.6C19.2025 15.6 18.363 14.7605 18.363 13.725C18.363 12.6895 19.2025 11.85 20.238 11.85C21.2735 11.85 22.113 12.6895 22.113 13.725Z"
				fill="currentColor"
			/>
			<mask id="path-3-inside-1_141_208" fill="white">
				<path d="M39 0H133V41H39V0Z" />
			</mask>
			<path
				d="M39 0V-1.5H37.5V0H39ZM133 0H134.5V-1.5H133V0ZM133 41V42.5H134.5V41H133ZM39 41H37.5V42.5H39V41ZM39 1.5H133V-1.5H39V1.5ZM131.5 0V41H134.5V0H131.5ZM133 39.5H39V42.5H133V39.5ZM40.5 41V0H37.5V41H40.5Z"
				fill="currentColor"
				mask="url(#path-3-inside-1_141_208)"
			/>
			<path
				d="M62.496 26.648L67.44 12.2H71.76V29H69.168V17.288C69.168 16.424 69.24 15.512 69.384 14.552H69L64.032 29H60.576L55.608 14.552H55.224C55.288 14.952 55.336 15.4 55.368 15.896C55.416 16.376 55.44 16.84 55.44 17.288V29H52.848V12.2H57.144L62.112 26.648H62.496ZM80.1698 19.136C79.5138 19.136 78.9538 19.288 78.4898 19.592C78.0258 19.88 77.6658 20.256 77.4098 20.72C77.1538 21.168 76.9858 21.64 76.9058 22.136L83.4338 22.16C83.3858 21.68 83.2338 21.208 82.9778 20.744C82.7218 20.28 82.3538 19.896 81.8738 19.592C81.4098 19.288 80.8418 19.136 80.1698 19.136ZM76.8338 23.72C76.8818 24.248 77.0178 24.776 77.2418 25.304C77.4658 25.816 77.8178 26.256 78.2978 26.624C78.7938 26.976 79.4178 27.152 80.1698 27.152C80.9538 27.152 81.5858 26.968 82.0658 26.6C82.5618 26.216 82.9298 25.704 83.1698 25.064H85.6898C85.4338 26.168 84.8658 27.152 83.9858 28.016C83.1218 28.864 81.8578 29.288 80.1938 29.288C78.8818 29.288 77.7858 28.992 76.9058 28.4C76.0418 27.792 75.4098 27.024 75.0098 26.096C74.6098 25.152 74.4098 24.168 74.4098 23.144C74.4098 22.12 74.6098 21.144 75.0098 20.216C75.4098 19.272 76.0418 18.504 76.9058 17.912C77.7858 17.304 78.8818 17 80.1938 17C81.5058 17 82.6018 17.304 83.4818 17.912C84.3618 18.52 85.0018 19.336 85.4018 20.36C85.8178 21.384 85.9938 22.504 85.9297 23.72H76.8338ZM90.1736 23.144C90.1736 24.264 90.4776 25.176 91.0856 25.88C91.7096 26.584 92.5336 26.936 93.5576 26.936C94.5656 26.936 95.3736 26.584 95.9816 25.88C96.6056 25.176 96.9176 24.264 96.9176 23.144C96.9176 22.024 96.6056 21.112 95.9816 20.408C95.3736 19.704 94.5656 19.352 93.5576 19.352C92.5336 19.352 91.7096 19.704 91.0856 20.408C90.4776 21.112 90.1736 22.024 90.1736 23.144ZM87.5816 23.144C87.5816 22.104 87.7656 21.112 88.1336 20.168C88.5016 19.224 89.0776 18.464 89.8616 17.888C90.6456 17.296 91.6216 17 92.7896 17C93.8776 17 94.7416 17.24 95.3816 17.72C96.0376 18.2 96.5496 18.816 96.9176 19.568H97.3016C97.0456 18.688 96.9176 17.752 96.9176 16.76V12.2H99.5096V29H96.9176V28.808C96.9176 28.472 96.9576 28.12 97.0376 27.752C97.1176 27.384 97.2056 27.04 97.3016 26.72H96.9176C96.8856 26.784 96.8296 26.888 96.7496 27.032C96.3976 27.704 95.8936 28.248 95.2376 28.664C94.5976 29.08 93.7576 29.288 92.7176 29.288C91.5816 29.288 90.6216 28.992 89.8376 28.4C89.0696 27.808 88.5016 27.048 88.1336 26.12C87.7656 25.176 87.5816 24.184 87.5816 23.144ZM105.148 17.552C105.324 17.712 105.412 17.92 105.412 18.176V29H102.82V20.12C102.82 19.976 102.772 19.864 102.676 19.784C102.58 19.688 102.468 19.64 102.34 19.64H101.284V17.288H104.524C104.764 17.288 104.972 17.376 105.148 17.552ZM103.06 13.904C103.332 14.16 103.66 14.288 104.044 14.288C104.396 14.288 104.7 14.16 104.956 13.904C105.228 13.632 105.364 13.32 105.364 12.968C105.364 12.6 105.228 12.288 104.956 12.032C104.7 11.776 104.396 11.648 104.044 11.648C103.66 11.648 103.332 11.776 103.06 12.032C102.804 12.288 102.676 12.6 102.676 12.968C102.676 13.32 102.804 13.632 103.06 13.904ZM116.191 22.64C116.047 22.752 115.775 22.864 115.375 22.976C114.975 23.072 114.447 23.176 113.791 23.288C113.279 23.384 112.711 23.48 112.087 23.576C111.575 23.656 111.119 23.864 110.719 24.2C110.319 24.52 110.119 24.936 110.119 25.448C110.119 25.928 110.287 26.336 110.623 26.672C110.959 26.992 111.367 27.192 111.847 27.272C112.359 27.32 112.799 27.32 113.167 27.272C113.535 27.224 113.951 27.072 114.415 26.816C114.895 26.544 115.279 26.2 115.567 25.784C115.871 25.368 116.055 24.936 116.119 24.488C116.167 24.184 116.191 23.856 116.191 23.504V22.64ZM120.247 29.024H118.375C117.911 29.024 117.543 28.888 117.271 28.616C117.015 28.328 116.887 27.968 116.887 27.536C116.887 27.2 116.927 26.872 117.007 26.552C117.087 26.216 117.175 25.92 117.271 25.664H116.887C116.711 26.176 116.447 26.68 116.095 27.176C115.743 27.672 115.335 28.072 114.871 28.376C114.263 28.76 113.615 29.024 112.927 29.168C112.239 29.312 111.519 29.336 110.767 29.24C110.223 29.176 109.711 29 109.231 28.712C108.751 28.408 108.367 28.008 108.079 27.512C107.791 27.016 107.647 26.464 107.647 25.856C107.647 24.896 107.903 24.152 108.415 23.624C108.943 23.096 109.623 22.736 110.455 22.544C110.839 22.448 111.247 22.376 111.679 22.328C112.111 22.264 112.511 22.208 112.879 22.16C113.535 22.08 114.047 22.008 114.415 21.944L114.727 21.872C115.223 21.776 115.583 21.656 115.807 21.512C116.031 21.352 116.103 21.096 116.023 20.744C115.959 20.44 115.799 20.168 115.543 19.928C115.287 19.672 114.959 19.48 114.559 19.352C114.175 19.208 113.735 19.136 113.239 19.136C112.631 19.136 112.103 19.24 111.655 19.448C111.207 19.656 110.863 19.936 110.623 20.288C110.383 20.64 110.263 21.016 110.263 21.416H107.743C107.743 20.664 107.951 19.952 108.367 19.28C108.799 18.592 109.431 18.04 110.263 17.624C111.095 17.208 112.103 17 113.287 17C114.455 17 115.455 17.216 116.287 17.648C117.119 18.064 117.743 18.616 118.159 19.304C118.575 19.992 118.783 20.744 118.783 21.56V26.168C118.783 26.296 118.831 26.416 118.927 26.528C119.039 26.624 119.167 26.672 119.311 26.672H120.247V29.024Z"
				fill="currentColor"
			/>
			<mask id="path-6-inside-2_141_208" fill="white">
				<path d="M131.5 0H234.5V41H131.5V0Z" />
			</mask>
			<path
				d="M131.5 0V-1.5H130V0H131.5ZM234.5 0H236V-1.5H234.5V0ZM234.5 41V42.5H236V41H234.5ZM131.5 41H130V42.5H131.5V41ZM131.5 1.5H234.5V-1.5H131.5V1.5ZM233 0V41H236V0H233ZM234.5 39.5H131.5V42.5H234.5V39.5ZM133 41V0H130V41H133Z"
				fill="currentColor"
				mask="url(#path-6-inside-2_141_208)"
			/>
			<path
				d="M147.94 12.2V29H145.348V12.2H147.94ZM170.685 20.096C170.941 20.784 171.069 21.456 171.069 22.112V29H168.477V22.304C168.477 21.504 168.261 20.808 167.829 20.216C167.413 19.608 166.781 19.256 165.933 19.16C165.197 19.08 164.581 19.184 164.085 19.472C163.589 19.76 163.205 20.16 162.933 20.672C162.677 21.184 162.501 21.744 162.405 22.352C162.341 23.216 162.309 24.096 162.309 24.992V29H159.933V22.304C159.933 21.488 159.725 20.792 159.309 20.216C158.909 19.624 158.261 19.28 157.365 19.184C156.645 19.088 156.037 19.192 155.541 19.496C155.045 19.784 154.661 20.184 154.389 20.696C154.133 21.192 153.957 21.744 153.861 22.352V22.472C153.829 22.984 153.805 23.4 153.789 23.72C153.773 24.024 153.765 24.448 153.765 24.992V29H151.173V17.288H153.765V17.888C153.765 18.256 153.709 18.672 153.597 19.136C153.485 19.584 153.357 20.008 153.213 20.408H153.597C153.853 19.528 154.261 18.808 154.821 18.248C155.381 17.688 156.021 17.32 156.741 17.144C157.477 16.952 158.213 16.944 158.949 17.12C159.637 17.28 160.181 17.576 160.581 18.008C160.981 18.44 161.253 18.888 161.397 19.352C161.557 19.816 161.629 20.168 161.613 20.408H161.997C162.285 19.528 162.725 18.808 163.317 18.248C163.909 17.688 164.573 17.32 165.309 17.144C166.045 16.952 166.773 16.944 167.493 17.12C168.277 17.312 168.941 17.68 169.485 18.224C170.029 18.768 170.429 19.392 170.685 20.096ZM183.08 23.144C183.08 22.024 182.768 21.112 182.144 20.408C181.536 19.704 180.712 19.352 179.672 19.352C179 19.352 178.4 19.512 177.872 19.832C177.36 20.152 176.96 20.6 176.672 21.176C176.4 21.752 176.264 22.408 176.264 23.144C176.264 24.264 176.576 25.176 177.2 25.88C177.824 26.584 178.648 26.936 179.672 26.936C180.344 26.936 180.936 26.776 181.448 26.456C181.976 26.136 182.376 25.688 182.648 25.112C182.936 24.536 183.08 23.88 183.08 23.144ZM185.672 23.144C185.672 24.184 185.48 25.176 185.096 26.12C184.712 27.048 184.12 27.808 183.32 28.4C182.536 28.992 181.56 29.288 180.392 29.288C179.304 29.288 178.432 29.048 177.776 28.568C177.12 28.072 176.616 27.456 176.264 26.72H175.88C176.136 27.6 176.264 28.536 176.264 29.528V35.672H173.672V17.288H176.264V17.456C176.264 17.808 176.224 18.168 176.144 18.536C176.064 18.904 175.976 19.248 175.88 19.568H176.264C176.296 19.472 176.344 19.36 176.408 19.232C176.664 18.816 176.96 18.448 177.296 18.128C177.648 17.792 178.088 17.52 178.616 17.312C179.144 17.104 179.76 17 180.464 17C181.616 17 182.584 17.296 183.368 17.888C184.152 18.48 184.728 19.248 185.096 20.192C185.48 21.12 185.672 22.104 185.672 23.144ZM195.988 22.64C195.844 22.752 195.572 22.864 195.172 22.976C194.772 23.072 194.244 23.176 193.588 23.288C193.076 23.384 192.508 23.48 191.884 23.576C191.372 23.656 190.916 23.864 190.516 24.2C190.116 24.52 189.916 24.936 189.916 25.448C189.916 25.928 190.084 26.336 190.42 26.672C190.756 26.992 191.164 27.192 191.644 27.272C192.156 27.32 192.596 27.32 192.964 27.272C193.332 27.224 193.748 27.072 194.212 26.816C194.692 26.544 195.076 26.2 195.364 25.784C195.668 25.368 195.852 24.936 195.916 24.488C195.964 24.184 195.988 23.856 195.988 23.504V22.64ZM200.044 29.024H198.172C197.708 29.024 197.34 28.888 197.068 28.616C196.812 28.328 196.684 27.968 196.684 27.536C196.684 27.2 196.724 26.872 196.804 26.552C196.884 26.216 196.972 25.92 197.068 25.664H196.684C196.508 26.176 196.244 26.68 195.892 27.176C195.54 27.672 195.132 28.072 194.668 28.376C194.06 28.76 193.412 29.024 192.724 29.168C192.036 29.312 191.316 29.336 190.564 29.24C190.02 29.176 189.508 29 189.028 28.712C188.548 28.408 188.164 28.008 187.876 27.512C187.588 27.016 187.444 26.464 187.444 25.856C187.444 24.896 187.7 24.152 188.212 23.624C188.74 23.096 189.42 22.736 190.252 22.544C190.636 22.448 191.044 22.376 191.476 22.328C191.908 22.264 192.308 22.208 192.676 22.16C193.332 22.08 193.844 22.008 194.212 21.944L194.524 21.872C195.02 21.776 195.38 21.656 195.604 21.512C195.828 21.352 195.9 21.096 195.82 20.744C195.756 20.44 195.596 20.168 195.34 19.928C195.084 19.672 194.756 19.48 194.356 19.352C193.972 19.208 193.532 19.136 193.036 19.136C192.428 19.136 191.9 19.24 191.452 19.448C191.004 19.656 190.66 19.936 190.42 20.288C190.18 20.64 190.06 21.016 190.06 21.416H187.54C187.54 20.664 187.748 19.952 188.164 19.28C188.596 18.592 189.228 18.04 190.06 17.624C190.892 17.208 191.9 17 193.084 17C194.252 17 195.252 17.216 196.084 17.648C196.916 18.064 197.54 18.616 197.956 19.304C198.372 19.992 198.58 20.744 198.58 21.56V26.168C198.58 26.296 198.628 26.416 198.724 26.528C198.836 26.624 198.964 26.672 199.108 26.672H200.044V29.024ZM208.593 26.456C209.041 26.12 209.377 25.696 209.601 25.184H212.337C212.033 26.352 211.425 27.328 210.513 28.112C209.617 28.896 208.401 29.288 206.865 29.288C205.553 29.288 204.465 28.992 203.601 28.4C202.737 27.792 202.105 27.024 201.705 26.096C201.305 25.152 201.105 24.168 201.105 23.144C201.105 22.12 201.305 21.144 201.705 20.216C202.105 19.272 202.737 18.504 203.601 17.912C204.465 17.304 205.553 17 206.865 17C207.905 17 208.801 17.192 209.553 17.576C210.305 17.96 210.905 18.464 211.353 19.088C211.817 19.712 212.145 20.392 212.337 21.128H209.601C209.393 20.616 209.057 20.192 208.593 19.856C208.145 19.52 207.569 19.352 206.865 19.352C206.145 19.352 205.545 19.536 205.065 19.904C204.601 20.272 204.257 20.744 204.033 21.32C203.809 21.896 203.697 22.504 203.697 23.144C203.697 23.784 203.809 24.392 204.033 24.968C204.257 25.544 204.601 26.016 205.065 26.384C205.545 26.752 206.145 26.936 206.865 26.936C207.569 26.936 208.145 26.776 208.593 26.456ZM215.397 27.08C215.125 26.504 214.989 25.896 214.989 25.256V19.64H213.093V17.288H214.989V12.2H217.581V17.288H221.061V19.64H217.581V25.232C217.581 25.616 217.717 25.952 217.989 26.24C218.261 26.512 218.589 26.648 218.973 26.648H221.061V29H218.733C217.933 29 217.245 28.824 216.669 28.472C216.109 28.12 215.685 27.656 215.397 27.08Z"
				fill="currentColor"
			/>
			<mask id="path-9-inside-3_141_208" fill="white">
				<path d="M233 0H344V41H233V0Z" />
			</mask>
			<path
				d="M233 0V-1.5H231.5V0H233ZM344 0H345.5V-1.5H344V0ZM344 41V42.5H345.5V41H344ZM233 41H231.5V42.5H233V41ZM233 1.5H344V-1.5H233V1.5ZM342.5 0V41H345.5V0H342.5ZM344 39.5H233V42.5H344V39.5ZM234.5 41V0H231.5V41H234.5Z"
				fill="currentColor"
				mask="url(#path-9-inside-3_141_208)"
			/>
			<path
				d="M256.496 26.648L261.44 12.2H265.76V29H263.168V17.288C263.168 16.424 263.24 15.512 263.384 14.552H263L258.032 29H254.576L249.608 14.552H249.224C249.288 14.952 249.336 15.4 249.368 15.896C249.416 16.376 249.44 16.84 249.44 17.288V29H246.848V12.2H251.144L256.112 26.648H256.496ZM274.122 27.344C274.922 27.344 275.578 27.144 276.09 26.744C276.602 26.328 276.978 25.8 277.218 25.16C277.458 24.52 277.578 23.848 277.578 23.144C277.578 22.44 277.458 21.768 277.218 21.128C276.978 20.488 276.602 19.968 276.09 19.568C275.578 19.152 274.922 18.944 274.122 18.944C273.322 18.944 272.658 19.152 272.13 19.568C271.618 19.968 271.242 20.488 271.002 21.128C270.778 21.768 270.666 22.44 270.666 23.144C270.666 23.848 270.778 24.52 271.002 25.16C271.242 25.8 271.618 26.328 272.13 26.744C272.658 27.144 273.322 27.344 274.122 27.344ZM274.122 17C275.418 17 276.49 17.304 277.338 17.912C278.202 18.504 278.826 19.272 279.21 20.216C279.61 21.144 279.81 22.12 279.81 23.144C279.81 24.168 279.61 25.152 279.21 26.096C278.826 27.024 278.202 27.792 277.338 28.4C276.49 28.992 275.418 29.288 274.122 29.288C272.81 29.288 271.722 28.992 270.858 28.4C270.01 27.792 269.386 27.024 268.986 26.096C268.602 25.152 268.41 24.168 268.41 23.144C268.41 22.12 268.602 21.144 268.986 20.216C269.386 19.272 270.01 18.504 270.858 17.912C271.722 17.304 272.81 17 274.122 17ZM292.985 20.144C293.241 20.848 293.369 21.56 293.369 22.28V29H290.777V22.472C290.777 21.544 290.569 20.776 290.153 20.168C289.753 19.56 289.113 19.208 288.233 19.112C287.529 19.032 286.921 19.128 286.409 19.4C285.913 19.672 285.521 20.064 285.233 20.576C284.961 21.088 284.785 21.68 284.705 22.352C284.641 23.296 284.609 24.264 284.609 25.256V29H282.017V17.288H284.609V17.888C284.609 18.256 284.553 18.672 284.441 19.136C284.329 19.584 284.201 20.008 284.057 20.408H284.417C284.657 19.528 285.057 18.808 285.617 18.248C286.177 17.688 286.825 17.32 287.561 17.144C288.313 16.952 289.057 16.944 289.793 17.12C290.593 17.312 291.265 17.688 291.809 18.248C292.353 18.792 292.745 19.424 292.985 20.144ZM298.82 17.552C298.996 17.712 299.084 17.92 299.084 18.176V29H296.492V20.12C296.492 19.976 296.444 19.864 296.348 19.784C296.252 19.688 296.14 19.64 296.012 19.64H294.956V17.288H298.196C298.436 17.288 298.644 17.376 298.82 17.552ZM296.732 13.904C297.004 14.16 297.332 14.288 297.716 14.288C298.068 14.288 298.372 14.16 298.628 13.904C298.9 13.632 299.036 13.32 299.036 12.968C299.036 12.6 298.9 12.288 298.628 12.032C298.372 11.776 298.068 11.648 297.716 11.648C297.332 11.648 297.004 11.776 296.732 12.032C296.476 12.288 296.348 12.6 296.348 12.968C296.348 13.32 296.476 13.632 296.732 13.904ZM302.975 27.08C302.703 26.504 302.567 25.896 302.567 25.256V19.64H300.671V17.288H302.567V12.2H305.159V17.288H308.639V19.64H305.159V25.232C305.159 25.616 305.295 25.952 305.567 26.24C305.839 26.512 306.167 26.648 306.551 26.648H308.639V29H306.311C305.511 29 304.823 28.824 304.247 28.472C303.687 28.12 303.263 27.656 302.975 27.08ZM315.653 27.344C316.453 27.344 317.109 27.144 317.621 26.744C318.133 26.328 318.509 25.8 318.749 25.16C318.989 24.52 319.109 23.848 319.109 23.144C319.109 22.44 318.989 21.768 318.749 21.128C318.509 20.488 318.133 19.968 317.621 19.568C317.109 19.152 316.453 18.944 315.653 18.944C314.853 18.944 314.189 19.152 313.661 19.568C313.149 19.968 312.773 20.488 312.533 21.128C312.309 21.768 312.197 22.44 312.197 23.144C312.197 23.848 312.309 24.52 312.533 25.16C312.773 25.8 313.149 26.328 313.661 26.744C314.189 27.144 314.853 27.344 315.653 27.344ZM315.653 17C316.949 17 318.021 17.304 318.869 17.912C319.733 18.504 320.357 19.272 320.741 20.216C321.141 21.144 321.341 22.12 321.341 23.144C321.341 24.168 321.141 25.152 320.741 26.096C320.357 27.024 319.733 27.792 318.869 28.4C318.021 28.992 316.949 29.288 315.653 29.288C314.341 29.288 313.253 28.992 312.389 28.4C311.541 27.792 310.917 27.024 310.517 26.096C310.133 25.152 309.941 24.168 309.941 23.144C309.941 22.12 310.133 21.144 310.517 20.216C310.917 19.272 311.541 18.504 312.389 17.912C313.253 17.304 314.341 17 315.653 17ZM329.026 17.792C329.698 17.456 330.458 17.288 331.306 17.288V19.64C330.234 19.64 329.346 19.88 328.642 20.36C327.954 20.824 327.45 21.432 327.13 22.184C326.81 22.92 326.65 23.696 326.65 24.512V29H324.058V20.024C324.058 19.896 324.026 19.8 323.962 19.736C323.898 19.672 323.802 19.64 323.674 19.64H322.378V17.288H325.282C325.602 17.288 325.858 17.368 326.05 17.528C326.242 17.688 326.338 17.92 326.338 18.224C326.338 18.864 326.218 19.872 325.978 21.248H326.338C326.562 20.464 326.898 19.776 327.346 19.184C327.81 18.592 328.37 18.128 329.026 17.792Z"
				fill="currentColor"
			/>
		</svg>
	);
}

export default Logo;
