<template>
<div>
	<b-navbar class="d-flex flex-column custom-nav p-0 position-fixed shadow left right text-white" vertical>
		<b-nav vertical class="w-100 text-white" style="padding-top: 72px; height: 100vh;">
			<li class="nav-item w-100 mt-xs-5" @click="showHandler('create')">
				<b-button
					variant="clean"
					block
					squared
					class="btn-home p-0 m-0 d-flex align-items-center w-100 justify-content-center text-white">
					<font-awesome-icon :icon="['fas', 'house-user']" />
				</b-button>
			</li>
			<li class="nav-item w-100" @click="showHandler('list')">
				<b-button
					variant="clean"
					block
					squared
					class="btn-home p-0 m-0 d-flex align-items-center w-100 justify-content-center text-white">
					<font-awesome-icon :icon="['fas', 'chart-bar']" />
				</b-button>
			</li>
			<li class="nav-item w-100" @click="showHandler('find')">
				<b-button
					variant="clean"
					block
					squared
					class="btn-home p-0 m-0 d-flex align-items-center w-100 justify-content-center text-white">
					<font-awesome-icon :icon="['fas', 'search-plus']" />
				</b-button>
			</li>
			<li class="nav-item w-100" @click="showHandler('payments')">
				<b-button
					variant="clean"
					block
					squared
					class="btn-home p-0 m-0 d-flex align-items-center w-100 justify-content-center text-white">
					<font-awesome-icon :icon="['fas', 'wallet']" />
				</b-button>
			</li>
			<li class="nav-item mt-auto help-btn">
				<div class="position-relative">
					<b-button class=" m-0 py-3 rounded-0  text-white" variant="clean" @click="showHandler('support')">
						<font-awesome-icon :icon="['fas', 'question']" />
					</b-button>
					<div class="position-absolute menuHelp cursor-pointer">
						<b-card v-show="showHelp" bg-variant="transparent" body-class="actionOffDropdown border-0">
							<div class="row mb-2">
								<a style="text-decoration: none; color:white;">Community</a>
							</div>
							<div class="row">
								<a style="text-decoration: none;">Support</a>
							</div>
						</b-card>
					</div>
				</div>
			</li>
		</b-nav>
	</b-navbar>
	<app-sidebar :show="create" :type="operationType" @closeCreate="toggleCreate"/>
</div>
</template>

<script>
import AppSidebar from '@/components/navigation/AppSidebar';

export default {
	name: 'AppNewNavbar',
	components: { AppSidebar },
	data() {
		return {
			onboardingModal: false,
			create: false,
			operationType: '',
			showHelp: false
		};
	},
	computed: {
		isMobile() {
			return screen.width < 576;
		}
	},
	mounted() {

	},
	methods: {
		ignoreNewline(evt) {
			if (evt.keyCode === 13) {
				evt.preventDefault();
			}
		},
		showHandler(value) {
			if (this.create) {
				if (this.operationType === value) {
					this.create = false;
				} else {
					this.operationType = value;
				}
				// this.operationType = 'find';
			} else {
				this.operationType = value;
				this.create = true;
			}
			// this.create = !this.create;
		},
		toggleCreate() {
			this.create = false;
			this.operationType = '';
		}
	}
};
</script>

<style scoped>
.custom-nav {
	width: 56px;
	/* border: 2px solid white; */
	z-index: 400;
	border-bottom-right-radius: 8px;
	height: 100%;
	background-color: #001E6C;
    color: white;
}

@media screen and (max-width: 767px) {
	.custom-nav {
		margin-left: 0px !important;
		width: 36px;
		height: calc(100vh);
		z-index: 900;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		border-bottom-left-radius: 0;
	}
}

.search-btn {
	border-bottom: 1px solid #FFFFFF4B;
}
.help-btn {
	border-top: 1px solid #FFFFFF4B;
}
.btn-home {
	height: 72px;
}
.user-img {
	display: inline-block;
	margin-top: 1.25rem;
	margin-bottom: 1.25rem;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	object-fit: cover;
}
.dropdown-menu {
	left: 5px
}

.menuHelp {
	bottom: 0px;
	left: 56px;
	flex-direction: column;
}

.actionOffDropdown {
    color: white !important;
    background-color: #001E6C;
	border: 0;
	border-radius: 8px;
}
</style>
