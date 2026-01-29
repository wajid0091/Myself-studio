import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, set, get, push, query, orderByChild, equalTo, onValue, serverTimestamp, update } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

// --- DOM Element References ---
const loadingScreen = document.getElementById('loadingScreen');
const googleSignInPanel = document.getElementById('googleSignInPanel');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const guestButtonAlt = document.getElementById('guestButtonAlt');
const completeProfileModal = document.getElementById('completeProfileModal');
const profileUsernameInput = document.getElementById('profileUsernameInput');
const profileReferralInput = document.getElementById('profileReferralInput');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const mainMenu = document.getElementById('mainMenu');
const gameOverMenu = document.getElementById('gameOverMenu');
const gameCanvas = document.getElementById('gameCanvas');
const marioGifSprite = document.getElementById('marioGifSprite'); 
const enemyGifContainer = document.getElementById('enemyGifContainer'); // NEW
const settingsModal = document.getElementById('settingsModal');
const profileModal = document.getElementById('profileModal');
const inviteModal = document.getElementById('inviteModal');
const withdrawModal = document.getElementById('withdrawModal');
const infoModal = document.getElementById('infoModal');
const withdrawalHistoryModal = document.getElementById('withdrawalHistoryModal');
const historyListDiv = document.getElementById('historyList');
const interstitialAdOverlay = document.getElementById('interstitialAdOverlay');
const interstitialAdCloseButton = document.getElementById('interstitialAdCloseButton');
const interstitialAdTimer = document.getElementById('interstitialAdTimer');
const adInfoText = document.getElementById('adInfoText');
const installPwaBtn = document.getElementById('installPwaBtn');
const characterSelectionModal = document.getElementById('characterSelectionModal');
const closeCharacterSelectionBtn = document.getElementById('closeCharacterSelection');
const characterContainer = document.getElementById('characterContainer');
const forceStartBtn = document.getElementById('forceStartBtn');

// Updated Coin/PKR Display Refs
const topRightStatusContainer = document.getElementById('topRightStatusContainer');
const menuCoinCountSpan = document.getElementById('menuCoinCount');
const menuPkrCountSpan = document.getElementById('menuPkrCount');

const finalTotalCoinsSpan = document.getElementById('finalTotalCoins');
const finalTotalPkrSpan = document.getElementById('finalTotalPkr');
const sessionCoinCountSpan = document.getElementById('sessionCoinCount');
const inviteFriendBtn = document.getElementById('inviteFriend');
const yourInviteLinkDisplay = document.getElementById('yourInviteLinkDisplay');
const redeemCodeInput = document.getElementById("redeemCodeInput");
const toggleSoundBtn = document.getElementById("toggleSound");
const redeemOptionsDiv = document.getElementById("redeemOptions");
const redeemFormDiv = document.getElementById("redeemForm");
const redeemDetailsForm = document.getElementById("redeemDetailsForm");
const redeemSubmitBtn = document.getElementById('redeemSubmitBtn');
const withdrawalHistoryBtn = document.getElementById('withdrawalHistoryBtn');
const closeHistoryModalBtn = document.getElementById('closeHistoryModal');
const profileBtn = document.getElementById('profileBtn');
const closeProfileModalBtn = document.getElementById('closeProfileModal');
const profileUsernameSpan = document.getElementById('profileUsername');
const profileEmailSpan = document.getElementById('profileEmail');
const profileTotalCoinsSpan = document.getElementById('profileTotalCoins');
const profileTotalPkrSpan = document.getElementById('profileTotalPkr');
const profileReferralCountSpan = document.getElementById('profileReferralCount');
const profileInviteCodeSpan = document.getElementById('profileInviteCode');
const profileJoinedDateSpan = document.getElementById('profileJoinedDate');
const statusMessageContainer = document.getElementById('statusMessageContainer');
const statusMessageText = document.getElementById('statusMessageText');
let statusMessageTimeoutId = null;
const backgroundAudio = document.getElementById("backgroundAudio");
const jumpSound = document.getElementById("jumpSound");
const coinSound = document.getElementById("coinSound");
const gameOverSound = document.getElementById("gameOverSound");
const settingsBtn = document.getElementById('settingsBtn');
const closeSettings = document.getElementById('closeSettings');
const infoBtn = document.getElementById('infoBtn');
const closeInfo = document.getElementById('closeInfo');
const copyInviteCode = document.getElementById('copyInviteCode');
const redeemCodeBtn = document.getElementById('redeemCodeBtn');
const closeInviteModal = document.getElementById('closeInviteModal');
const withdrawBtn = document.getElementById('withdrawBtn');
const closeWithdraw = document.getElementById('closeWithdraw');
const logoutBtn = document.getElementById('logoutBtn');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const backMenuBtn = document.getElementById('backMenuBtn');
const customerService = document.getElementById('customerService');
const accountHolderName = document.getElementById('accountHolderName');
const accountNumber = document.getElementById('accountNumber');
const referralTaskDisplay = document.getElementById('referralTaskDisplay');
const whatsappBtn = document.getElementById('whatsappBtn');
const swapCoinsBtnWithdraw = document.getElementById('swapCoinsBtnWithdraw'); // New Button in Withdraw Modal

// --- Spin Wheel Elements ---
const spinBtn = document.getElementById('spinBtn');
const spinWheelModal = document.getElementById('spinWheelModal');
const closeSpinWheelBtn = document.getElementById('closeSpinWheel');
const wheelSvg = document.getElementById('wheelSvg');
const freeSpinBtn = document.getElementById('freeSpinBtn');
const buySpinBtn = document.getElementById('buySpinBtn');
const spinsLeftDisplay = document.getElementById('spinsLeftDisplay');
const cooldownTimerDisplay = document.getElementById('cooldownTimerDisplay');
const spinStatusDisplay = document.getElementById('spinStatus');
const spinStartSound = document.getElementById('spinStartSound');
const spinWinSound = document.getElementById('spinWinSound');

// --- Swap Modal Elements ---
const swapModal = document.getElementById('swapModal');
const closeSwapModalBtn = document.getElementById('closeSwapModal');
const swapCurrentCoinsSpan = document.getElementById('swapCurrentCoins');
const swapCurrentPkrSpan = document.getElementById('swapCurrentPkr');
const swapToPkrBtn = document.getElementById('swapToPkrBtn');

// --- Game Transactions Elements (NEW) ---
const gameTransactionsBtn = document.getElementById('gameTransactionsBtn');
const gameTransactionsModal = document.getElementById('gameTransactionsModal');
const closeTransactionsModalBtn = document.getElementById('closeTransactionsModal');
const transactionsListDiv = document.getElementById('transactionsList');


// --- New Profile Info Elements ---
const profileTotalPlayTimeSpan = document.getElementById('profileTotalPlayTime');
const profileTotalSpinCoinsSpan = document.getElementById('profileTotalSpinCoins');
const profileTotalSpinPkrSpan = document.getElementById('profileTotalSpinPkr');
const profileTotalCoinsSwappedSpan = document.getElementById('profileTotalCoinsSwapped');
const profileLastActiveSpan = document.getElementById('profileLastActive');


const firebaseConfig = {
  apiKey: "AIzaSyCpheUGTtliJyTXjVlm1VnfvGTbaeykQ7E", authDomain: "super-mario-earn-real-money.firebaseapp.com",
  databaseURL: "https://super-mario-earn-real-money-default-rtdb.firebaseio.com", projectId: "super-mario-earn-real-money",
  storageBucket: "super-mario-earn-real-money.firebasestorage.app", messagingSenderId: "527750706733",
  appId: "1:527750706733:web:71f31dc125468ca645eaa4", measurementId: "G-Z25ZFF8PWT"
};

// --- Firebase Initialization ---
let appFirebase, db, auth;
try {
    appFirebase = initializeApp(firebaseConfig);
    db = getDatabase(appFirebase);
    auth = getAuth();
    console.log("Firebase initialized successfully.");
} catch (error) {
    console.error("Firebase initialization failed:", error);
    showStatusMessage("Connection error. Cannot initialize.", "error", 10000);
}

// --- Game Configuration ---
let gameConfig = {
    backgrounds: {
        login: 'https://i.imgur.com/nxRZ03R.png',
        mainMenu: 'https://i.imgur.com/KFWJlte.png',
        modalDefault: 'https://i.imgur.com/KFWJlte.png',
        characterSelect: 'https://i.imgur.com/KFWJlte.png'
    },
    coinToPkrRate: 100, // 100 coins = 1 PKR
    swapBlock: 10000,
    characters: {},
    // NEW: Enemies object will be populated from Firebase.
    enemies: {},
    // UPDATED: Withdrawal options now focus on PKR, not Coins
    withdrawalOptions: {
        "option1": { pkr: 100, referralsNeeded: 5, isOneTime: true, text: "100 Rs (One-Time)" },
        "option2": { pkr: 300, referralsNeeded: 10, isOneTime: false, text: "300 Rs" },
        "option3": { pkr: 500, referralsNeeded: 20, isOneTime: false, text: "500 Rs" },
        "option4": { pkr: 800, referralsNeeded: 30, isOneTime: false, text: "800 Rs" },
        "option5": { pkr: 1000, referralsNeeded: 40, isOneTime: false, text: "1000 Rs" },
        "option6": { pkr: 5000, referralsNeeded: 50, isOneTime: false, text: "5000 Rs" }
    }
};
let selectedCharacter = null;


// --- Global State ---
let totalCoins = 0;
let totalPKR = 0;
let totalSpinCoinsEarned = 0;
let totalSpinPkrEarned = 0;
let totalPlayTimeMinutes = 0;
let totalCoinsSwapped = 0;
let lastActiveTimestamp = 0;
let soundEnabled = true;
let currentUserInviteCode = null;
let currentUsername = null;
let currentReferralCount = 0;
let currentJoinedDate = null;
let userPurchasedCharacters = [];
let hasWithdrawnOneTime = {};
let gameStarted = false;
let gameOver = false;
let score = 0;
let mario, obstacles, coins, speed, bgX, platformX;
let lastJumpInputTime = 0;
const doubleJumpWindow = 350;
let canDoubleJump = false;
let animationFrameId = null;
let allImagesLoaded = false;
let isProcessingAuth = false;
let coinListenerUnsubscribe = null;
let profileCompleteListener = null;
let gameStartTime = 0;
let deferredInstallPrompt = null;
let activeEnemyGifs = {}; // NEW: To manage enemy GIF elements

// --- Ad Logic Variables ---
let isFirstLaunch = true;
let retryCounter = 0;


// --- Spin Wheel State ---
let spinsLeft = 0;
let lastSpinTime = 0;
const spinCooldownHours = 3;
const spinCooldownMilliseconds = spinCooldownHours * 60 * 60 * 1000;
const spinBuyPrice = 1000;


// --- Constants ---
const SIGNUP_BONUS = 100;
const REFERRER_BONUS = 200;
const REDEEMER_BONUS = 100;
const baseInviteUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;

const spinWheelRewards = [
    { name: '1 Rs', type: 'pkr', amount: 1, weight: 50, color: '#f44336' },
    { name: '5 Rs', type: 'pkr', amount: 5, weight: 40, color: '#ff9800' },
    { name: '10 Rs', type: 'pkr', amount: 10, weight: 20, color: '#ffeb3b' },
    { name: '50 Rs', type: 'pkr', amount: 50, weight: 1, color: '#4caf50' },
    { name: '100 Rs', type: 'pkr', amount: 100, weight: 0.1, color: '#2196f3' },
    { name: '100 Coins', type: 'coins', amount: 100, weight: 50, color: '#9c27b0' },
    { name: '200 Coins', type: 'coins', amount: 200, weight: 40, color: '#e91e63' },
    { name: '500 Coins', type: 'coins', amount: 500, weight: 30, color: '#00bcd4' },
    { name: '5000 Coins', type: 'coins', amount: 5000, weight: 1, color: '#8bc34a' },
    { name: '10000 Coins', type: 'coins', amount: 10000, weight: 0.1, color: '#ff5722' }
];
const totalSpinWeight = spinWheelRewards.reduce((sum, reward) => sum + reward.weight, 0);


// --- Status Message Function ---
function showStatusMessage(message, type = 'info', duration = 3000) {
    if (statusMessageTimeoutId) { clearTimeout(statusMessageTimeoutId); statusMessageContainer.classList.remove('show'); }
    console.log(`Status [${type}]: ${message}`);
    statusMessageText.textContent = message;
    statusMessageContainer.className = 'statusMessageContainer'; statusMessageContainer.classList.add(type);
    statusMessageContainer.style.display = 'block'; statusMessageContainer.style.top = '15px'; statusMessageContainer.style.transform = 'translateX(-50%) scale(0.9)';
    void statusMessageContainer.offsetWidth; statusMessageContainer.classList.add('show');
    statusMessageTimeoutId = setTimeout(() => {
        statusMessageContainer.classList.remove('show'); statusMessageTimeoutId = null;
        setTimeout(() => { if (!statusMessageContainer.classList.contains('show')) statusMessageContainer.style.display = 'none'; }, 400);
    }, duration);
}

// --- Config Functions ---
async function fetchGameConfig() {
    console.log("Fetching remote game config...");
    try {
        const configRef = ref(db, 'gameConfig');
        const snapshot = await get(configRef);
        if (snapshot.exists()) {
            const remoteConfig = snapshot.val();
            if (remoteConfig.characters) {
                remoteConfig.characters = {...gameConfig.characters, ...remoteConfig.characters};
            }
            if (remoteConfig.enemies) { // NEW
                remoteConfig.enemies = {...gameConfig.enemies, ...remoteConfig.enemies};
            }
            // Merge withdrawal options carefully to preserve structure if remote differs
            if (remoteConfig.withdrawalOptions) {
                gameConfig.withdrawalOptions = remoteConfig.withdrawalOptions;
            }
            gameConfig = { ...gameConfig, ...remoteConfig };
            console.log("Remote config fetched and merged:", gameConfig);
        } else {
            console.log("No remote config found, using default.");
        }
    } catch (error) {
        console.error("Error fetching remote config, using default:", error);
        // Continue even if config fetch fails, use local defaults
    }
}

function applyGameConfig() {
    console.log("Applying game config to UI...");
    const root = document.documentElement;
    root.style.setProperty('--bg-login-panel', `url('${gameConfig.backgrounds.login}')`);
    root.style.setProperty('--bg-main-menu', `url('${gameConfig.backgrounds.mainMenu}')`);
    root.style.setProperty('--bg-modal-default', `url('${gameConfig.backgrounds.modalDefault}')`);
    // UPDATED to use new config property
    root.style.setProperty('--bg-char-select', `url('${gameConfig.backgrounds.characterSelect}')`);
    
    const pkrPerBlock = gameConfig.swapBlock / gameConfig.coinToPkrRate;
    const swapRateP = document.querySelector("#swapModal p:nth-of-type(2)");
    if (swapRateP) {
        swapRateP.innerHTML = `Swap Rate: <strong>${gameConfig.swapBlock} Coins</strong> = <span class="pkr-highlight">${pkrPerBlock} Rs</span>`;
    }
}


// --- MODIFIED AD INTEGRATION ---
const directLinkUrl = "https://www.effectivegatecpm.com/zi30dfhjnn?key=b78830ea0cb80a28c4b278ee2e122b06";

function showInterstitialAd(callback) {
     console.log("Attempting to show Interstitial Ad (direct flow)...");
     const user = auth?.currentUser;
     const isLoggedAndProfiled = user && currentUsername;

     if (!isLoggedAndProfiled) {
         console.log("Not logged in or profile incomplete, skipping ad.");
         if (typeof callback === 'function') { try { callback(); } catch (e) { console.error("Error in ad callback after skip:", e); } }
         return;
     }

     if (typeof callback !== 'function') { console.error("Invalid ad callback."); return; }

     let adWindow = null;
     try {
         adWindow = window.open(directLinkUrl, '_blank');
     } catch (e) {
         console.error("Error opening ad window:", e);
     }

     if (!adWindow) {
         console.warn("Pop-up blocked. Proceeding with action immediately.");
         showStatusMessage("Ad might be blocked.", "info");
     }

     try {
         callback();
     } catch (e) {
         console.error("Error in ad callback:", e);
         showStatusMessage("Error proceeding.", "error");
     }
}

// --- Sound Functions ---
function playSound(audioElement) { if (soundEnabled && audioElement) { try { audioElement.currentTime=0; audioElement.play().catch(e=>console.warn(`Sound play error (${audioElement.id}):`, e)); } catch(e) { console.warn("Sound play failed:", e); } } }
function playBackgroundMusic() { if (soundEnabled && backgroundAudio && backgroundAudio.paused) { backgroundAudio.play().catch(e=>console.warn("Background music play failed:",e)); } }
function stopBackgroundMusic() { if (backgroundAudio && !backgroundAudio.paused) { backgroundAudio.pause(); backgroundAudio.currentTime=0; } }

// --- Authentication Logic ---
function setAuthProcessing(isProcessing) {
    console.log(`Setting Auth Processing: ${isProcessing}`); isProcessingAuth = isProcessing;
    const signInPanelVisible = googleSignInPanel.style.display === 'flex';
    const profileModalVisible = completeProfileModal.style.display === 'flex';

    if(signInPanelVisible) {
         if(googleSignInBtn) googleSignInBtn.disabled = isProcessing;
         if(guestButtonAlt) guestButtonAlt.disabled = isProcessing;
    } else {
         if(googleSignInBtn) googleSignInBtn.disabled = false;
         if(guestButtonAlt) guestButtonAlt.disabled = false;
    }

    if(profileModalVisible) {
         if(saveProfileBtn) saveProfileBtn.disabled = isProcessing;
    } else {
         if(saveProfileBtn) saveProfileBtn.disabled = false;
    }

    if(logoutBtn) logoutBtn.disabled = isProcessing;
    if(startBtn) startBtn.disabled = isProcessing || !allImagesLoaded;
    if(withdrawBtn) withdrawBtn.disabled = isProcessing;
    if(inviteFriendBtn) inviteFriendBtn.disabled = isProcessing;
    if(infoBtn) infoBtn.disabled = isProcessing;
    if(installPwaBtn) installPwaBtn.disabled = isProcessing;
    if(settingsBtn) settingsBtn.style.pointerEvents = isProcessing ? 'none' : 'auto';
    if (topRightStatusContainer) topRightStatusContainer.style.pointerEvents = isProcessing ? 'none' : 'auto';
    if (whatsappBtn) whatsappBtn.style.pointerEvents = isProcessing ? 'none' : 'auto';
    if (spinBtn) spinBtn.style.pointerEvents = isProcessing ? 'none' : 'auto';

    const anyModalOpen = settingsModal.style.display === 'flex' || profileModal.style.display === 'flex' || inviteModal.style.display === 'flex' || withdrawModal.style.display === 'flex' || infoModal.style.display === 'flex' || withdrawalHistoryModal.style.display === 'flex' || spinWheelModal.style.display === 'flex' || swapModal.style.display === 'flex' || gameTransactionsModal.style.display === 'flex' || characterSelectionModal.style.display === 'flex';
    if (anyModalOpen) {
         document.querySelectorAll('.modal-content .game-btn, .modal-content .redeem-option, .modal-content .char-action-btn').forEach(btn => {
             if (!btn.dataset.preAuthDisabled) {
                 btn.dataset.preAuthDisabled = btn.disabled;
             }
             btn.disabled = isProcessing || (btn.dataset.preAuthDisabled === 'true');
         });
    } else {
        document.querySelectorAll('.modal-content .game-btn, .modal-content .redeem-option, .modal-content .char-action-btn').forEach(btn => {
             if (btn.dataset.preAuthDisabled !== undefined) {
                 btn.disabled = (btn.dataset.preAuthDisabled === 'true');
                 delete btn.dataset.preAuthDisabled;
             } else {
                 btn.disabled = isProcessing;
             }
         });
    }
}


async function handleGoogleSignInSuccess(userCredential) {
    const user = userCredential.user;
    console.log(`Google Sign-In Success for: ${user.uid}. Checking profile...`);
    setAuthProcessing(true);
    try {
        const userRef = ref(db, `users/${user.uid}`); const snapshot = await get(userRef);
        if (snapshot.exists() && snapshot.val().username) {
            console.log("Existing user with username found.");
            showStatusMessage(`Welcome back, ${snapshot.val().username}!`, "success", 2000);

            const updates = { lastActiveTimestamp: serverTimestamp() };
            await update(userRef, updates).catch(e => console.error("Error updating last active timestamp on login:", e));

            showInterstitialAd(async () => {
                try {
                    await loadUserData(user.uid);
                    setupCoinListener(user.uid);
                    showMainMenu();
                    checkUrlForReferral();
                } catch (loadError) {
                    console.error("Failed to load user data after ad:", loadError);
                    showStatusMessage("Error loading profile data.", "error");
                     hideAllViewsAndModalsExcept(googleSignInPanel);
                     if(loadingScreen) loadingScreen.style.display = 'none';
                     googleSignInPanel.style.display = 'flex';
                } finally {
                    setAuthProcessing(false);
                }
            });
        } else {
            console.log("New user or profile incomplete.");
            showStatusMessage("Complete your profile.", "info", 3000);
            profileUsernameInput.value = user.displayName || ""; profileReferralInput.value = "";
            const urlParams = new URLSearchParams(window.location.search); const refCode = urlParams.get('ref');
             if (refCode) { profileReferralInput.value = refCode.trim().toUpperCase(); console.log("Referral code pre-filled."); const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname; window.history.replaceState({path:cleanUrl},'',cleanUrl); }
            hideAllViewsAndModalsExcept(completeProfileModal);
            if(loadingScreen) loadingScreen.style.display = 'none';
            completeProfileModal.style.display = "flex";
            if(profileCompleteListener) saveProfileBtn.removeEventListener('click', profileCompleteListener);
            profileCompleteListener = createProfileCompletionHandler(user); saveProfileBtn.addEventListener('click', profileCompleteListener);
            setAuthProcessing(false);
        }
    } catch (error) {
        console.error("Error checking user existence:", error); showStatusMessage("Error loading profile.", "error");
        signOut(auth).catch(e => console.error("Sign out error:", e));
        setAuthProcessing(false);
    }
}

function createProfileCompletionHandler(user) {
    return async () => {
        if (isProcessingAuth) return;
        const chosenUsername = profileUsernameInput.value.trim(); const referralCode = profileReferralInput.value.trim().toUpperCase();
        
        // UPDATED: Simple validation, allowing spaces for "Full Name"
        if (chosenUsername.length < 3) { showStatusMessage("Name must be >= 3 chars.", "error"); return; }
        // Updated Regex to allow spaces for full names
        if (!/^[a-zA-Z0-9_ ]+$/.test(chosenUsername)) { showStatusMessage("Invalid name characters.", "error"); return; }
        
        console.log(`Saving profile for ${user.uid}. User: ${chosenUsername}, Ref: ${referralCode}`);
        setAuthProcessing(true); saveProfileBtn.disabled = true; showStatusMessage("Creating profile...", "info");
        try {
            const generatedInviteCode = generateRandomCode(); const creationTime = serverTimestamp();
            const initialUserData = {
                 email: user.email,
                 username: chosenUsername,
                 uid: user.uid,
                 totalCoins: SIGNUP_BONUS,
                 totalPKR: 0,
                 referralCount: 0,
                 referralRedeemed: false,
                 codeRedeemedFrom: null,
                 inviteCode: generatedInviteCode,
                 createdAt: creationTime,
                 provider: 'google',
                 spinsLeft: 1,
                 lastSpinTime: creationTime,
                 hasWithdrawnOneTime: {},
                 purchasedCharacters: [],
                 totalSpinCoinsEarned: 0,
                 totalSpinPkrEarned: 0,
                 totalPlayTimeMinutes: 0,
                 totalCoinsSwapped: 0,
                 lastActiveTimestamp: creationTime,
                 transactions: {}
            };
            console.log(`1: Setting initial data (+${SIGNUP_BONUS} coins)...`);
            await set(ref(db, `users/${user.uid}`), initialUserData);
            console.log("2: Initial DB data set.");
            let referralMessage = ""; let finalCoins = SIGNUP_BONUS;
            const updatesAfterReferral = { lastActiveTimestamp: serverTimestamp() };

            if (referralCode) {
                console.log(`3: Attempting referral: ${referralCode}`);
                try {
                    const { newCoinsForRedeemer, referrerUid } = await redeemInviteCode(referralCode, user.uid, initialUserData);
                    console.log("4: Referral success.");
                    finalCoins = newCoinsForRedeemer;
                    updatesAfterReferral.referralRedeemed = true;
                    updatesAfterReferral.codeRedeemedFrom = referrerUid;

                    console.log("5: User record updated with redemption details.");
                    referralMessage = ` +${REDEEMER_BONUS} referral bonus!`;
                } catch (redeemError) {
                    console.warn("4: Referral error:", redeemError.message);
                    referralMessage = ` (Referral error: ${redeemError.message})`;
                }
            }
             totalCoins = finalCoins;
             totalPKR = 0;
             totalSpinCoinsEarned = 0;
             totalSpinPkrEarned = 0;
             totalPlayTimeMinutes = 0;
             totalCoinsSwapped = 0;
             lastActiveTimestamp = Date.now();

             await update(ref(db, `users/${user.uid}`), updatesAfterReferral);

             if (user && user.uid) {
                const newTransactionRef = push(ref(db, `users/${user.uid}/transactions`));
                await set(newTransactionRef, {
                    type: 'signup_bonus',
                    amount: SIGNUP_BONUS,
                    timestamp: serverTimestamp(),
                    details: `Signup Bonus`
                }).catch(e => console.error("Error saving signup transaction:", e));

                if (referralCode && updatesAfterReferral.referralRedeemed) {
                    const newReferralTransactionRef = push(ref(db, `users/${user.uid}/transactions`));
                     await set(newReferralTransactionRef, {
                         type: 'referral_bonus',
                         amount: REDEEMER_BONUS,
                         timestamp: serverTimestamp(),
                         details: `Referral bonus from code: ${referralCode}`
                     }).catch(e => console.error("Error saving referral bonus transaction:", e));
                }
             }


            showStatusMessage(`Profile created! +${SIGNUP_BONUS} bonus${referralMessage}`, "success", 6000);
            completeProfileModal.style.display = "none";
             showInterstitialAd(async () => {
                try {
                    await loadUserData(user.uid);
                    setupCoinListener(user.uid);
                    showMainMenu();
                } catch (loadError) {
                    console.error("Failed to load data after profile creation/ad:", loadError);
                    showStatusMessage("Error loading profile data.", "error");
                     hideAllViewsAndModalsExcept(googleSignInPanel);
                     if(loadingScreen) loadingScreen.style.display = 'none';
                     googleSignInPanel.style.display = 'flex';
                } finally {
                    setAuthProcessing(false);
                }
             });
        } catch (dbError) {
            console.error("Error saving profile:", dbError); showStatusMessage("Error saving profile.", "error");
            setAuthProcessing(false); saveProfileBtn.disabled = false;
        }
    };
}

googleSignInBtn.addEventListener("click", () => {
    if (isProcessingAuth) return; console.log("Google Sign In clicked."); setAuthProcessing(true); showStatusMessage("Opening Google Sign-in...", "info", 2000);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(handleGoogleSignInSuccess).catch((error) => {
        console.error("Google Sign-In Error:", error); let errorMsg = "Google Sign-in failed.";
        if (error.code === 'auth/popup-closed-by-user') errorMsg = "Sign-in cancelled.";
        else if (error.code === 'auth/network-request-failed') errorMsg = "Network error.";
        else if (error.code === 'auth/cancelled-popup-request') return;
        showStatusMessage(errorMsg, "error", 4000); setAuthProcessing(false);
    });
});

guestButtonAlt.addEventListener("click", () => {
    console.log("Guest button clicked."); if (isProcessingAuth) return; setAuthProcessing(true);
    try {
         resetAppStateToLoggedOut();
         hideAllViewsAndModalsExcept(mainMenu);
         if(loadingScreen) loadingScreen.style.display = 'none';
         showMainMenu();
         showStatusMessage("Playing as Guest.", "info", 4000);
    }
    catch (error) { console.error("Error entering guest mode:", error); showStatusMessage("Error starting guest mode.", "error"); hideAllViewsAndModalsExcept(googleSignInPanel); if(loadingScreen) loadingScreen.style.display = 'none'; googleSignInPanel.style.display = "flex"; }
    finally { setAuthProcessing(false); }
});

function hideAllViewsAndModalsExcept(exceptElement = null) {
    const viewsAndModals = [
        googleSignInPanel, mainMenu, gameCanvas, gameOverMenu, completeProfileModal,
        settingsModal, profileModal, inviteModal, withdrawModal, infoModal,
        withdrawalHistoryModal, spinWheelModal, swapModal, gameTransactionsModal,
        characterSelectionModal
    ];
    viewsAndModals.forEach(el => {
        if (el && el !== exceptElement) {
            el.style.display = 'none';
        }
    });
     if (marioGifSprite) marioGifSprite.style.display = 'none';
     if (enemyGifContainer) enemyGifContainer.innerHTML = ''; // Clear enemy gifs
     if (whatsappBtn && whatsappBtn !== exceptElement) whatsappBtn.style.display = 'none';
     if (spinBtn && spinBtn !== exceptElement) spinBtn.style.display = 'none';
     if (topRightStatusContainer && topRightStatusContainer !== exceptElement) topRightStatusContainer.style.display = 'none';
     if (settingsBtn && settingsBtn !== exceptElement) settingsBtn.style.display = 'none';
}


onAuthStateChanged(auth, async (user) => {
  console.log("Auth State Changed. User:", user ? user.uid : 'null');
  if (coinListenerUnsubscribe) { console.log("Removing existing data listener."); coinListenerUnsubscribe(); coinListenerUnsubscribe = null; }

  // Fallback check to ensure loading screen goes away
  setTimeout(() => {
      if(loadingScreen.style.display === 'flex' && !isProcessingAuth && (mainMenu.style.display === 'flex' || googleSignInPanel.style.display === 'flex')) {
          console.warn("Loading screen stuck? Hiding it forcibly.");
          loadingScreen.style.display = 'none';
      }
  }, 2000);

  if (user) {
      setAuthProcessing(true);
      try {
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists() && snapshot.val().username) {
              console.log("Auth State: Existing user session with profile.");
               console.log("Auth State: Loading user data and updating UI.");
               await loadUserData(user.uid);
               setupCoinListener(user.uid);

                const isAnyModalOpen = settingsModal.style.display === 'flex' ||
                                     profileModal.style.display === 'flex' ||
                                     inviteModal.style.display === 'flex' ||
                                     withdrawModal.style.display === 'flex' ||
                                     infoModal.style.display === 'flex' ||
                                     withdrawalHistoryModal.style.display === 'flex' ||
                                     spinWheelModal.style.display === 'flex' ||
                                     swapModal.style.display === 'flex' ||
                                     gameTransactionsModal.style.display === 'flex' ||
                                     characterSelectionModal.style.display === 'flex';


               if (gameCanvas.style.display === 'block' || gameOverMenu.style.display === 'flex' || isAnyModalOpen) {
                    console.log("Auth State: User logged in, staying on current view (game/modal). Updating UI elements.");
                     updateCoinPkrDisplay();
                     updateWithdrawalOptionStates();
                     updateInviteButtonText(currentReferralCount);
                     updateInviteLinkDisplay();
                     updateSpinUI();
                     updateSwapModalState();
                     if (!gameStarted && !gameOver) {
                         if (whatsappBtn) whatsappBtn.style.display = 'flex';
                         if (settingsBtn) settingsBtn.style.display = 'flex';
                         if (topRightStatusContainer) topRightStatusContainer.style.display = 'flex';
                         updateSpinUI();
                     }


               } else if (completeProfileModal.style.display === 'flex') {
                    console.log("Auth State: User logged in, profile modal is active. Ensure others are hidden.");
                    hideAllViewsAndModalsExcept(completeProfileModal);
                    if(loadingScreen) loadingScreen.style.display = 'none';

               } else {
                   console.log("Auth State: User logged in, profile complete, no other view active. Showing main menu.");
                    hideAllViewsAndModalsExcept(mainMenu);
                    if(loadingScreen) loadingScreen.style.display = 'none';
                    showMainMenu();
               }
               checkUrlForReferral();

          } else {
              console.warn("Auth State: User authenticated but profile incomplete.");
               profileUsernameInput.value = user.displayName || ""; profileReferralInput.value = "";
               hideAllViewsAndModalsExcept(completeProfileModal);
               if(loadingScreen) loadingScreen.style.display = 'none';
               completeProfileModal.style.display = "flex";
               if(profileCompleteListener) saveProfileBtn.removeEventListener('click', profileCompleteListener);
               profileCompleteListener = createProfileCompletionHandler(user); saveProfileBtn.addEventListener('click', profileCompleteListener);
          }
      } catch (dbError) {
          console.error("Auth State: Error checking DB:", dbError); showStatusMessage("Error verifying profile.", "error");
          signOut(auth).catch(e => console.error("Sign out error:", e));
          hideAllViewsAndModalsExcept(googleSignInPanel);
          if(loadingScreen) loadingScreen.style.display = 'none';
          googleSignInPanel.style.display = "flex";
      } finally { setAuthProcessing(false); }
  } else {
      console.log("User signed out.");
      resetAppStateToLoggedOut();
      hideAllViewsAndModalsExcept(googleSignInPanel);
      if(loadingScreen) loadingScreen.style.display = 'none';
      googleSignInPanel.style.display = "flex";
      stopBackgroundMusic();
      setAuthProcessing(false);
  }
});


// --- Real-time User Data Listener Setup ---
function setupCoinListener(userId) {
     if (!userId) { console.error("No userId for data listener."); return; }
     if (coinListenerUnsubscribe) { console.warn("Removing existing data listener."); coinListenerUnsubscribe(); coinListenerUnsubscribe = null; }
     const userRefPath = `users/${userId}`;
     const userRef = ref(db, userRefPath);
     console.log(`Setting up user data listener for ${userId}`);
     coinListenerUnsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
             const userData = snapshot.val();
             const newCoins = userData.totalCoins ?? 0;
             const newPKR = userData.totalPKR ?? 0;
             const newRefCount = userData.referralCount ?? 0;
             const newSpinsLeft = userData.spinsLeft ?? 0;
             const newLastSpinTime = userData.lastSpinTime ?? 0;
             const newHasWithdrawnOneTime = userData.hasWithdrawnOneTime ?? {};
             const newPurchasedChars = userData.purchasedCharacters ?? [];

             const newSpinCoinsEarned = userData.totalSpinCoinsEarned ?? 0;
             const newSpinPkrEarned = userData.totalSpinPkrEarned ?? 0;
             const newPlayTimeMinutes = userData.totalPlayTimeMinutes ?? 0;
             const newCoinsSwapped = userData.totalCoinsSwapped ?? 0;
             const processedLastActive = (userData.lastActiveTimestamp && typeof userData.lastActiveTimestamp === 'object' && typeof userData.lastActiveTimestamp.seconds === 'number')
                ? userData.lastActiveTimestamp.seconds * 1000 + (userData.lastActiveTimestamp.nanoseconds || 0) / 1000000
                : userData.lastActiveTimestamp || 0;


             let stateChanged = false;
             if (totalCoins != newCoins) { totalCoins = newCoins; stateChanged = true; }
             if (totalPKR != newPKR) { totalPKR = newPKR; stateChanged = true; }
             if (currentReferralCount != newRefCount) { currentReferralCount = newRefCount; stateChanged = true; }
             if (spinsLeft != newSpinsLeft) { spinsLeft = newSpinsLeft; stateChanged = true; }
             if (lastSpinTime != newLastSpinTime) {
                 lastSpinTime = (newLastSpinTime && typeof newLastSpinTime === 'object' && typeof newLastSpinTime.seconds === 'number')
                   ? newLastSpinTime.seconds * 1000 + (newLastSpinTime.nanoseconds || 0) / 1000000
                   : newLastSpinTime || 0;
                 stateChanged = true;
             }
             if (JSON.stringify(hasWithdrawnOneTime) != JSON.stringify(newHasWithdrawnOneTime)) { hasWithdrawnOneTime = newHasWithdrawnOneTime; stateChanged = true; }
             if (JSON.stringify(userPurchasedCharacters) !== JSON.stringify(newPurchasedChars)) { userPurchasedCharacters = newPurchasedChars; stateChanged = true; }

             if (totalSpinCoinsEarned != newSpinCoinsEarned) { totalSpinCoinsEarned = newSpinCoinsEarned; stateChanged = true; }
             if (totalSpinPkrEarned != newSpinPkrEarned) { totalSpinPkrEarned = newSpinPkrEarned; stateChanged = true; }
             if (totalPlayTimeMinutes != newPlayTimeMinutes) { totalPlayTimeMinutes = newPlayTimeMinutes; stateChanged = true; }
             if (totalCoinsSwapped != newCoinsSwapped) { totalCoinsSwapped = newCoinsSwapped; stateChanged = true; }
             if (lastActiveTimestamp != processedLastActive) { lastActiveTimestamp = processedLastActive; stateChanged = true; }


             if (stateChanged) {
                 console.log(`State changed. Updating relevant UI...`);
                 updateCoinPkrDisplay();

                 if (finalTotalCoinsSpan && gameOverMenu.style.display === 'flex') finalTotalCoinsSpan.innerText = totalCoins;
                  if (finalTotalPkrSpan && gameOverMenu.style.display === 'flex') finalTotalPkrSpan.innerText = totalPKR;
                  if (profileModal.style.display === 'flex') {
                     showProfileModal();
                  }


                 updateInviteButtonText(currentReferralCount);
                 updateWithdrawalOptionStates();
                 updateSpinUI();
                  updateSwapModalState();
                  if(characterSelectionModal.style.display === 'flex') {
                    showCharacterSelectionScreen(); 
                  }

                  if (mainMenu.style.display === 'flex') {
                    if (topRightStatusContainer.style.display !== 'flex') topRightStatusContainer.style.display = 'flex';
                    if (whatsappBtn) whatsappBtn.style.display = 'flex';
                    if (settingsBtn) settingsBtn.style.display = 'flex';
                  }

                 console.log(`UI updated.`);
             }
        } else {
            console.warn(`RT Listener: User node ${userId} no longer exists.`);
            if (coinListenerUnsubscribe) { coinListenerUnsubscribe(); coinListenerUnsubscribe = null; }
            signOut(auth).catch(e => console.error("Sign out error on missing node:", e));
        }
     }, (error) => {
         console.error("Firebase user data listener error:", error); showStatusMessage("Data sync error.", "error");
         if (coinListenerUnsubscribe) { coinListenerUnsubscribe(); coinListenerUnsubscribe = null; }
     });
 }

function updateCoinPkrDisplay() {
    if (menuCoinCountSpan) menuCoinCountSpan.innerText = totalCoins;
    if (menuPkrCountSpan) menuPkrCountSpan.innerText = totalPKR;
}

function formatPlayTime(minutes) {
    if (minutes === 0) return "0 min";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let timeString = "";
    if (hours > 0) timeString += `${hours} hr `;
    if (remainingMinutes > 0 || hours === 0) timeString += `${remainingMinutes} min`;
    return timeString.trim();
}

 function formatTimestamp(timestamp) {
     if (!timestamp) return "N/A";
     try {
          const date = new Date(timestamp);
          if (isNaN(date)) return "Invalid Date";
          return date.toLocaleString();
     } catch (e) {
          console.error("Error formatting timestamp:", e);
          return "Error";
     }
 }


// --- Reset & Load Data ---
function resetAppStateToLoggedOut() {
    console.log("Resetting app state to logged-out...");
    if (coinListenerUnsubscribe) { coinListenerUnsubscribe(); coinListenerUnsubscribe = null; }
    totalCoins = 0; totalPKR = 0; hasWithdrawnOneTime = {};
    userPurchasedCharacters = [];
    totalSpinCoinsEarned = 0; totalSpinPkrEarned = 0; totalPlayTimeMinutes = 0; totalCoinsSwapped = 0; lastActiveTimestamp = 0;
    currentUserInviteCode = null; currentUsername = null; currentReferralCount = 0; currentJoinedDate = null;
    spinsLeft = 0; lastSpinTime = 0;
    gameStarted = false; gameOver = false; score = 0; if(animationFrameId) cancelAnimationFrame(animationFrameId); animationFrameId = null;
    stopBackgroundMusic();
    updateCoinPkrDisplay();
    if (finalTotalCoinsSpan) finalTotalCoinsSpan.innerText = "0";
    if (finalTotalPkrSpan) finalTotalPkrSpan.innerText = "0";
    if (sessionCoinCountSpan) sessionCoinCountSpan.innerText = "0";
    updateInviteButtonText(0); if (yourInviteLinkDisplay) yourInviteLinkDisplay.textContent = "N/A (Log in)";
    if (profileUsernameSpan) profileUsernameSpan.textContent = "..."; if (profileEmailSpan) profileEmailSpan.textContent = "...";
    if (profileTotalCoinsSpan) profileTotalCoinsSpan.textContent = "0";
    if (profileTotalPkrSpan) profileTotalPkrSpan.textContent = "0";
    if (profileReferralCountSpan) profileReferralCountSpan.textContent = "0";
    if (profileTotalPlayTimeSpan) profileTotalPlayTimeSpan.textContent = "...";
    if (profileTotalSpinCoinsSpan) profileTotalSpinCoinsSpan.textContent = "0";
    if (profileTotalSpinPkrSpan) profileTotalSpinPkrSpan.textContent = "0";
    if (profileTotalCoinsSwappedSpan) profileTotalCoinsSwappedSpan.textContent = "0";
    if (profileLastActiveSpan) profileLastActiveSpan.textContent = "...";
    if (profileInviteCodeSpan) profileInviteCodeSpan.textContent = "..."; if (profileJoinedDateSpan) profileJoinedDateSpan.textContent = "...";
    mario = null; obstacles = []; coins = []; isProcessingAuth = false;
    updateSpinUI();
    updateSwapModalState();
    updateWithdrawalOptionStates();
    if (transactionsListDiv) transactionsListDiv.innerHTML = '<p class="no-transactions">Log in to see transactions.</p>';


    mainMenu.style.display = 'none';
    gameCanvas.style.display = 'none';
    gameOverMenu.style.display = 'none';
    completeProfileModal.style.display = 'none';
    settingsModal.style.display = "none";
    profileModal.style.display = "none";
    inviteModal.style.display = "none";
    withdrawModal.style.display = "none";
    infoModal.style.display = "none";
    withdrawalHistoryModal.style.display = "none";
    spinWheelModal.style.display = 'none';
    swapModal.style.display = 'none';
    gameTransactionsModal.style.display = 'none';
    characterSelectionModal.style.display = 'none';
    topRightStatusContainer.style.display = 'none';
    if (whatsappBtn) whatsappBtn.style.display = 'none';
    if (spinBtn) spinBtn.style.display = 'none';
    if (settingsBtn) settingsBtn.style.display = 'none';
    if (marioGifSprite) marioGifSprite.style.display = 'none';
    if (enemyGifContainer) enemyGifContainer.innerHTML = '';

    // Reset Ad Logic
    isFirstLaunch = true;
    retryCounter = 0;


    console.log("App state reset complete.");
}

function loadUserData(userId) {
   return new Promise((resolve, reject) => {
       if (!userId) {
           console.error("loadUserData: No userId.");
           showStatusMessage("Cannot load data.", "error");
           return reject(new Error("No userId provided"));
       }
       console.log(`Loading data for: ${userId}`);
       const userRef = ref(db, `users/${userId}`);
       get(userRef).then(snapshot => {
           if (snapshot.exists()) {
               const userData = snapshot.val();
               console.log("User data fetched:", userData);
               totalCoins = userData.totalCoins || 0;
               totalPKR = userData.totalPKR || 0;
               currentUsername = userData.username || 'Gamer';
               currentReferralCount = userData.referralCount || 0;
               currentUserInviteCode = userData.inviteCode;
               spinsLeft = userData.spinsLeft ?? 0;
               hasWithdrawnOneTime = userData.hasWithdrawnOneTime ?? {};
               userPurchasedCharacters = userData.purchasedCharacters ?? [];
               lastSpinTime = (userData.lastSpinTime && typeof userData.lastSpinTime === 'object' && typeof userData.lastSpinTime.seconds === 'number')
                   ? userData.lastSpinTime.seconds * 1000 + (userData.lastSpinTime.nanoseconds || 0) / 1000000
                   : userData.lastSpinTime || 0;

               totalSpinCoinsEarned = userData.totalSpinCoinsEarned ?? 0;
               totalSpinPkrEarned = userData.totalSpinPkrEarned ?? 0;
               totalPlayTimeMinutes = userData.totalPlayTimeMinutes ?? 0;
               totalCoinsSwapped = userData.totalCoinsSwapped ?? 0;
                lastActiveTimestamp = (userData.lastActiveTimestamp && typeof userData.lastActiveTimestamp === 'object' && typeof userData.lastActiveTimestamp.seconds === 'number')
                    ? userData.lastActiveTimestamp.seconds * 1000 + (userData.lastActiveTimestamp.nanoseconds || 0) / 1000000
                    : userData.lastActiveTimestamp || 0;


               if (userData.createdAt) {
                   if (typeof userData.createdAt === 'number') {
                       try { currentJoinedDate = new Date(userData.createdAt).toLocaleDateString(); }
                       catch (e) { console.warn("Error parsing numeric timestamp:", e); currentJoinedDate = "N/A"; }
                   } else if (typeof userData.createdAt === 'object' && userData.createdAt.seconds) {
                       try { currentJoinedDate = new Date(userData.createdAt.seconds * 1000).toLocaleDateString(); }
                       catch (e) { console.warn("Error parsing timestamp object:", e); currentJoinedDate = "N/A"; }
                   } else {
                       console.warn("Unrecognized createdAt format:", userData.createdAt); currentJoinedDate = "N/A";
                   }
               } else { currentJoinedDate = "N/A"; }

               updateCoinPkrDisplay();
               updateInviteButtonText(currentReferralCount);
               updateInviteLinkDisplay();
               updateWithdrawalOptionStates();
               updateSpinUI();
               updateSwapModalState();


               if (!currentUserInviteCode && auth.currentUser?.uid === userId) {
                    console.log("Generating invite code...");
                    const newCode = generateRandomCode();
                    set(ref(db, `users/${userId}/inviteCode`), newCode)
                       .then(() => {
                           console.log("New invite code saved:", newCode);
                           currentUserInviteCode = newCode;
                           updateInviteLinkDisplay();
                           if (profileModal.style.display === 'flex') profileInviteCodeSpan.textContent = newCode;
                           resolve();
                       })
                       .catch(e => {
                           console.error("Error saving invite code:", e);
                           if(yourInviteLinkDisplay) yourInviteLinkDisplay.textContent = "Error";
                           resolve();
                       });
               } else {
                   resolve();
               }
           } else {
               console.error(`CRITICAL: User node missing: ${userId}. Logging out.`);
               showStatusMessage("Profile data missing! Logging out.", "error", 5000);
               signOut(auth).catch(e => console.error("Sign out error on missing node:", e));
               reject(new Error(`User node missing: ${userId}`));
           }
       }).catch(error => {
           console.error("Error fetching user data:", error);
           showStatusMessage("Failed to load user data.", "error");
           reject(error);
       });
   });
}

function checkUrlForReferral() {
    try {
        const urlParams = new URLSearchParams(window.location.search); const refCode = urlParams.get('ref');
        if (refCode) { const cleanCode = refCode.trim().toUpperCase(); console.log("URL Referral code:", cleanCode); if (auth.currentUser && redeemCodeInput) { redeemCodeInput.value = cleanCode; console.log("Referral code pre-filled."); showStatusMessage(`Ready to redeem code: ${cleanCode}?`, "info", 4000); } const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname; window.history.replaceState({path:cleanUrl},'',cleanUrl); console.log("Cleaned URL."); }
    } catch (e) { console.error("Error processing URL params:", e); }
}

// --- UI Update & View Navigation ---
function updateInviteButtonText(count) { inviteFriendBtn.innerText = `Invite (${count || 0} Refs)`; }
function updateSoundButton() {
    toggleSoundBtn.textContent=`Sound: ${soundEnabled?'On':'Off'}`;
    const onGradient="linear-gradient(145deg, #4caf50, #388e3c)";
    const offGradient="linear-gradient(145deg, #9e9e9e, #757575)";
    const onBorder='#1b5e20';
    const offBorder='#424242';
    toggleSoundBtn.style.background=soundEnabled?onGradient:offGradient;
    toggleSoundBtn.style.borderBottomColor=soundEnabled?onBorder:offBorder;
}
function updateInviteLinkDisplay() { if (yourInviteLinkDisplay) { if (currentUserInviteCode && auth.currentUser) yourInviteLinkDisplay.textContent = `${baseInviteUrl}?ref=${currentUserInviteCode}`; else if (auth.currentUser) yourInviteLinkDisplay.textContent = "Generating link..."; else yourInviteLinkDisplay.textContent = "Log in to get your invite link"; } if (profileInviteCodeSpan && profileModal.style.display === 'flex') profileInviteCodeSpan.textContent = currentUserInviteCode || '...'; }

function showMainMenu() {
    console.log("Showing Main Menu...");
    gameStarted = false; gameOver = false; if (animationFrameId) cancelAnimationFrame(animationFrameId);
    stopBackgroundMusic();
    if (marioGifSprite) marioGifSprite.style.display = 'none';
    if (enemyGifContainer) enemyGifContainer.innerHTML = '';

    hideAllViewsAndModalsExcept(mainMenu);

    mainMenu.style.display = "flex";

    const user = auth.currentUser;
    if (user && currentUsername) {
         console.log("User logged in, showing full menu.");
         logoutBtn.style.display = 'inline-flex';
         withdrawBtn.style.display = 'inline-flex';
         inviteFriendBtn.style.display = 'inline-flex';
         settingsBtn.style.display = 'flex';
         topRightStatusContainer.style.display = 'flex';
         if (deferredInstallPrompt) {
            installPwaBtn.style.display = 'inline-flex';
         } else {
            installPwaBtn.style.display = 'none';
         }

         updateCoinPkrDisplay();
         updateInviteButtonText(currentReferralCount);
         updateInviteLinkDisplay();
         updateWithdrawalOptionStates();
         updateSpinUI();
         updateSwapModalState();
         if (whatsappBtn) whatsappBtn.style.display = 'flex';

         const userRef = ref(db, `users/${user.uid}`);
         update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on menu show:", e));

    } else {
         console.log("Guest/Incomplete profile, showing limited menu.");
         logoutBtn.style.display = 'none';
         withdrawBtn.style.display = 'none';
         inviteFriendBtn.style.display = 'none';
         settingsBtn.style.display = 'none';
         topRightStatusContainer.style.display = 'none';
         if (installPwaBtn) installPwaBtn.style.display = 'none';

         updateCoinPkrDisplay();
         updateInviteButtonText(0);
         updateInviteLinkDisplay();
         updateWithdrawalOptionStates();
         if (whatsappBtn) whatsappBtn.style.display = 'flex';
         updateSpinUI();
    }

    playBackgroundMusic();
    console.log("showMainMenu finished.");
}

function showGameOverMenu() {
    console.log("Showing Game Over Menu"); gameStarted = false; gameOver = true;
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    if (marioGifSprite) marioGifSprite.style.display = 'none';
    if (enemyGifContainer) enemyGifContainer.innerHTML = '';

    const user = auth.currentUser;
    if (user && currentUsername && gameStartTime > 0) {
        const userRef = ref(db, `users/${user.uid}`);

         get(userRef).then(snap => {
             if (!snap.exists()) {
                 console.error("User data missing on game over! Cannot save score.");
                 showStatusMessage("Error saving game data.", "error");
             } else {
                 const currentData = snap.val();
                 const currentTotalCoins = currentData.totalCoins ?? 0;
                 const currentTotalPlayTimeMinutes = currentData.totalPlayTimeMinutes ?? 0;

                 const sessionDurationMs = gameStartTime > 0 ? Date.now() - gameStartTime : 0;
                 const sessionDurationMinutes = Math.max(0, Math.floor(sessionDurationMs / (1000 * 60)));

                 const newTotalCoins = currentTotalCoins + Math.floor(score);
                 const newTotalPlayTimeMinutes = currentTotalPlayTimeMinutes + sessionDurationMinutes;

                 const updates = {};
                 updates[`/users/${user.uid}/totalCoins`] = newTotalCoins;
                 updates[`/users/${user.uid}/totalPlayTimeMinutes`] = newTotalPlayTimeMinutes;
                 updates[`/users/${user.uid}/lastActiveTimestamp`] = serverTimestamp();


                 console.log(`Saving game over data: Score=${Math.floor(score)}, Session Time=${sessionDurationMinutes}min, Total Time=${newTotalPlayTimeMinutes}min`);

                 totalCoins = newTotalCoins;
                 totalPlayTimeMinutes = newTotalPlayTimeMinutes;

                 const newTransactionRef = push(ref(db, `users/${user.uid}/transactions`));
                 updates[`/users/${user.uid}/transactions/${newTransactionRef.key}`] = {
                     type: 'game_score',
                     amount: Math.floor(score),
                     timestamp: serverTimestamp(),
                     details: `Game Score: ${Math.floor(score)} Coins`
                 };


                 update(ref(db), updates)
                    .then(() => console.log(`Game over data and transaction submitted for UID: ${user.uid}`))
                    .catch(e => { console.error("Error saving game over data/transaction:", e); showStatusMessage("Error saving game data.", "error"); });
             }
              gameStartTime = 0;

         }).catch(e => {
             console.error("Error fetching user data on game over:", e);
             showStatusMessage("Error saving game data.", "error");
              gameStartTime = 0;
         });

    } else { console.log("Guest or incomplete profile, game data not saved.");
         gameStartTime = 0;
    }


    sessionCoinCountSpan.innerText = Math.floor(score);
    finalTotalCoinsSpan.innerText = auth.currentUser ? totalCoins : 0;
    finalTotalPkrSpan.innerText = auth.currentUser ? totalPKR : 0;

    hideAllViewsAndModalsExcept(gameOverMenu);
    gameOverMenu.style.display="flex";

    if (whatsappBtn) whatsappBtn.style.display = 'flex';
    if (spinBtn) spinBtn.style.display = 'none'; 
    topRightStatusContainer.style.display = 'none';
    if (settingsBtn) settingsBtn.style.display = 'none';


    stopBackgroundMusic();
    playSound(gameOverSound);
    console.log("Game Over Menu shown.");
}

// --- Settings & Profile Modals ---
settingsBtn.addEventListener("click", () => { if (!auth.currentUser || !currentUsername) { showStatusMessage("Log in & complete profile.", "info"); return; } updateSoundButton(); hideAllViewsAndModalsExcept(settingsModal); settingsModal.style.display = "flex"; });
closeSettings.addEventListener("click", () => { settingsModal.style.display = "none"; showMainMenu(); });
toggleSoundBtn.addEventListener("click", () => { soundEnabled = !soundEnabled; updateSoundButton(); if (!soundEnabled) stopBackgroundMusic(); else if (mainMenu.style.display==='flex'||(gameStarted&&!gameOver)) playBackgroundMusic(); showStatusMessage(`Sound ${soundEnabled ? 'On' : 'Off'}`, 'info', 1500); });
customerService.addEventListener("click", () => { window.open("https://wa.me/923019022815", "_blank"); });
profileBtn.addEventListener('click', showProfileModal);
closeProfileModalBtn.addEventListener('click', () => { profileModal.style.display = 'none'; showMainMenu(); });

function showProfileModal() {
    const user = auth.currentUser;
    if (!user || !currentUsername) { showStatusMessage("Log in & complete profile.", "error"); return; }

    profileUsernameSpan.textContent = currentUsername || '...';
    profileEmailSpan.textContent = user.email || 'N/A';
    profileTotalCoinsSpan.textContent = totalCoins;
    profileTotalPkrSpan.textContent = totalPKR;
    profileReferralCountSpan.textContent = currentReferralCount;
    profileInviteCodeSpan.textContent = currentUserInviteCode || '...';
    profileJoinedDateSpan.textContent = currentJoinedDate || '...';

    profileTotalPlayTimeSpan.textContent = formatPlayTime(totalPlayTimeMinutes);
    profileTotalSpinCoinsSpan.textContent = totalSpinCoinsEarned;
    profileTotalSpinPkrSpan.textContent = totalSpinPkrEarned;
    profileTotalCoinsSwappedSpan.textContent = totalCoinsSwapped;
    profileLastActiveSpan.textContent = formatTimestamp(lastActiveTimestamp);

     const userRef = ref(db, `users/${user.uid}`);
     update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on profile show:", e));


    hideAllViewsAndModalsExcept(profileModal);
    profileModal.style.display = 'flex';
}

// --- Game Transactions Modal ---
gameTransactionsBtn.addEventListener('click', showGameTransactions);
closeTransactionsModalBtn.addEventListener('click', () => { gameTransactionsModal.style.display = 'none'; showMainMenu(); });

async function showGameTransactions() {
     const user = auth.currentUser;
     if (!user) {
         showStatusMessage("Log in first.", "error");
         return;
     }
     if (isProcessingAuth) return;

     transactionsListDiv.innerHTML = '<p class="no-transactions">Loading...</p>';
     hideAllViewsAndModalsExcept(gameTransactionsModal);
     gameTransactionsModal.style.display = 'flex';

     const userRef = ref(db, `users/${user.uid}`);
     update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on transactions show:", e));


     console.log(`Fetching transaction history for UID: ${user.uid}. Ensure Firebase rules allow read and '.indexOn': ['timestamp'] is set for 'users/$uid/transactions'.`);

     try {
         const transactionsRef = ref(db, `users/${user.uid}/transactions`);
         const q = query(transactionsRef, orderByChild('timestamp'));

         const snapshot = await get(q);

         transactionsListDiv.innerHTML = '';

         if (snapshot.empty) {
             console.log("Query for transactions returned no documents.");
             transactionsListDiv.innerHTML = '<p class="no-transactions">No transaction history found.</p>';
         } else {
             console.log(`Transaction history query returned ${snapshot.size} document(s).`);
             try {
                 const data = [];
                 snapshot.forEach(childSnapshot => {
                     const itemData = childSnapshot.val();
                     if (typeof itemData === 'object' && itemData !== null && itemData.timestamp) {
                          data.push({ key: childSnapshot.key, ...itemData });
                     } else {
                          console.warn("Encountered invalid transaction data for key:", childSnapshot.key, itemData);
                     }
                 });

                 data.sort((a, b) => {
                     const tA = (typeof a.timestamp === 'object' && a.timestamp && typeof a.timestamp.seconds === 'number') ? (a.timestamp.seconds * 1000 + (a.timestamp.nanoseconds || 0) / 1000000) : (typeof a.timestamp === 'number' ? a.timestamp : 0);
                     const tB = (typeof b.timestamp === 'object' && b.timestamp && typeof b.timestamp.seconds === 'number') ? (b.timestamp.seconds * 1000 + (b.timestamp.nanoseconds || 0) / 1000000) : (typeof b.timestamp === 'number' ? b.timestamp : 0);
                     return tB - tA;
                 });
                 console.log("Processed and sorted transaction data:", data);


                 if (data.length === 0) {
                      transactionsListDiv.innerHTML = '<p class="no-transactions">No valid transaction items to display after processing.</p>';
                 } else {
                     data.forEach(item => {
                         const itemDiv = document.createElement('div');
                         itemDiv.classList.add('transaction-item');

                         let date = null;
                         if (item.timestamp) {
                             if (typeof item.timestamp === 'object' && item.timestamp && typeof item.timestamp.seconds === 'number') {
                                 date = new Date(item.timestamp.seconds * 1000 + (item.timestamp.nanoseconds || 0) / 1000000);
                             } else if (typeof item.timestamp === 'number') {
                                 date = new Date(item.timestamp);
                             }
                         }
                         const fDate = date ? date.toLocaleString() : 'N/A';

                          let amountText = `${item.amount || 0} ${item.type.includes('pkr') ? 'Rs' : 'Coins'}`;
                          if (item.type === 'swap_coins' && item.pkr_added !== undefined) {
                              amountText = `${item.amount || 0} Coins -> ${item.pkr_added || 0} Rs`;
                          }


                         itemDiv.innerHTML = `
<div class="details">
 <strong>${item.details || item.type}:</strong> <span>${amountText}</span>
</div>
<div class="meta">
 <span class="type type-${item.type}">${item.type.replace('_', ' ')}</span>
 <span class="date">${fDate}</span>
</div>`;
                         transactionsListDiv.appendChild(itemDiv);
                     });
                 }
             } catch (processingError) {
                 console.error("Error processing transaction history data:", processingError);
                 transactionsListDiv.innerHTML = '<p class="no-transactions" style="color: red;">Error processing history data. Check console.</p>';
                 showStatusMessage("Error displaying transactions.", "error");
             }
         }

     } catch (fetchError) {
         console.error("Error fetching transaction history:", fetchError);
          transactionsListDiv.innerHTML = '<p class="no-transactions" style="color: red;">Error loading history.</p><p class="no-transactions" style="font-size:0.9em; color:orange;">(This might require correcting database rules or indexing in Firebase console. Check the browser console for technical details.)</p>';
         showStatusMessage("Could not load transaction history.", "error");
     }
}

// --- Withdrawal History ---
withdrawalHistoryBtn.addEventListener('click', showWithdrawalHistory);
closeHistoryModalBtn.addEventListener('click', () => { withdrawalHistoryModal.style.display = 'none'; showMainMenu(); });

async function showWithdrawalHistory() {
    const user = auth.currentUser;
    if (!user) {
        showStatusMessage("Log in first.", "error");
        return;
    }
    historyListDiv.innerHTML = '<p class="no-history">Loading...</p>';
    hideAllViewsAndModalsExcept(withdrawalHistoryModal);
    withdrawalHistoryModal.style.display = 'flex';
    console.log(`Fetching withdrawal history for UID: ${user.uid}. Ensure Firebase rules allow read and '.indexOn': ['uid'] is set for 'withdrawRequests'.`);

     const userRef = ref(db, `users/${user.uid}`);
     update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on history show:", e));


    try {
        const reqRef = ref(db, 'withdrawRequests');
        const q = query(reqRef, orderByChild('uid'), equalTo(user.uid));
        const snapshot = await get(q);

        historyListDiv.innerHTML = '';

        if (snapshot.empty) {
            console.log("Query for withdrawal history returned no documents.");
            historyListDiv.innerHTML = '<p class="no-history">No withdrawal history found.</p>';
        } else {
            console.log(`Withdrawal history query returned ${snapshot.size} document(s).`);
            try {
                const data = [];
                snapshot.forEach(childSnapshot => {
                    const itemData = childSnapshot.val();
                    if (typeof itemData === 'object' && itemData !== null) {
                        data.push({ key: childSnapshot.key, ...itemData });
                    } else {
                        console.warn("Encountered non-object value in withdrawal history for doc ID:", childSnapshot.key, itemData);
                    }
                });

                data.sort((a, b) => {
                    const tA = (typeof a.timestamp === 'object' && a.timestamp && typeof a.timestamp.seconds === 'number') ? (a.timestamp.seconds * 1000 + (a.timestamp.nanoseconds || 0) / 1000000) : (typeof a.timestamp === 'number' ? a.timestamp : 0);
                    const tB = (typeof b.timestamp === 'object' && b.timestamp && typeof b.timestamp.seconds === 'number') ? (b.timestamp.seconds * 1000 + (b.timestamp.nanoseconds || 0) / 1000000) : (typeof b.timestamp === 'number' ? b.timestamp : 0);
                    return tB - tA;
                });
                console.log("Processed and sorted history data:", data);


                if (data.length === 0) {
                    historyListDiv.innerHTML = '<p class="no-history">No valid history items to display after processing.</p>';
                } else {
                    data.forEach(item => {
                        const itemDiv = document.createElement('div');
                        itemDiv.classList.add('history-item');

                        let date = null;
                        if (item.timestamp) {
                            if (typeof item.timestamp === 'object' && item.timestamp && typeof item.timestamp.seconds === 'number') {
                                date = new Date(item.timestamp.seconds * 1000 + (item.timestamp.nanoseconds || 0) / 1000000);
                            } else if (typeof item.timestamp === 'number') {
                                date = new Date(item.timestamp);
                            }
                        }
                        const fDate = date ? date.toLocaleString() : 'N/A';
                        const status = (item.status || 'pending').toLowerCase();
                        let sClass = 'status-pending';
                        if (status === 'approved') sClass = 'status-approved';
                        else if (status === 'rejected') sClass = 'status-rejected';

                        const pkrAmount = item.pkrAmount !== undefined ? item.pkrAmount : '?';

                        itemDiv.innerHTML = `
<div class="details">
<span>${pkrAmount} Rs</span>
<span>Method: ${item.paymentMethod || 'N/A'}</span>
<span>Acc: ${item.accountNumber || 'N/A'} (${item.accountHolderName || 'N/A'})</span>
</div>
<div class="status ${sClass}">${status}</div>
<div class="date">${fDate}</div>`;
                        historyListDiv.appendChild(itemDiv);
                    });
                }
            } catch (processingError) {
                console.error("Error processing withdrawal history data:", processingError);
                historyListDiv.innerHTML = '<p class="no-history" style="color: red;">Error processing history data. Check console.</p>';
                showStatusMessage("Error displaying history.", "error");
            }
        }
    } catch (fetchError) {
        console.error("Error fetching withdrawal history:", fetchError);
        historyListDiv.innerHTML = '<p class="no-history" style="color: red;">Error loading history.</p><p class="no-history" style="font-size:0.9em; color:orange;">(This might require correcting database rules or indexing in Firebase console. Check the browser console for technical details.)</p>';
        showStatusMessage("Could not load withdrawal history.", "error");
    }
}


// --- Invite Logic ---
function generateRandomCode() { return Math.random().toString(36).substring(2, 8).toUpperCase(); }
async function redeemInviteCode(code, currentUserId, currentUserData) {
    console.log(`Redeeming: ${code} by ${currentUserId}`);
    if (!currentUserId) throw new Error("User ID missing.");
    if (!code) throw new Error("Enter code.");
    code = code.trim().toUpperCase();
    if (currentUserData?.inviteCode && code === currentUserData.inviteCode) throw new Error("Cannot redeem own code.");
    if (currentUserData?.referralRedeemed === true) throw new Error("Already redeemed code.");

    const usersRef = ref(db, "users");
    const q = query(usersRef, orderByChild("inviteCode"), equalTo(code));
    const snap = await get(q);

    if (!snap.exists()) throw new Error("Invalid code.");

    let refUid = null, refData = null;
    snap.forEach(childSnapshot => {
         const data = childSnapshot.val();
         if (childSnapshot.key !== currentUserId && data && data.username) {
             refUid = childSnapshot.key;
             refData = data;
         } else if (childSnapshot.key === currentUserId) {
             console.warn("Query found self-match for invite code.");
         } else {
             console.warn("Found code but user profile is incomplete/invalid:", childSnapshot.key);
         }
     });

    if (!refUid || !refData) throw new Error("Invalid code.");

    console.log(`Found referrer: ${refUid}`);
     const referrerRef = ref(db, `users/${refUid}`);
     const referrerSnap = await get(referrerRef);
     if (!referrerSnap.exists()) {
          console.error("Referrer data missing during redemption!");
          throw new Error("Referrer profile error.");
     }
     const latestReferrerData = referrerSnap.val();
     const latestRefRefCount = latestReferrerData.referralCount || 0;
     const latestRefCoins = latestReferrerData.totalCoins || 0;


    const redeemUserCoins = currentUserData.totalCoins || 0;
    const newRedeemerTotal = redeemUserCoins + REDEEMER_BONUS;

    const newReferrerTotal = latestRefCoins + REFERRER_BONUS;
    const newReferrerCount = latestRefRefCount + 1;


    console.log(`Bonuses: Redeemer +${REDEEMER_BONUS}, Referrer +${REFERRER_BONUS}`);

    const updates = {};
    updates[`/users/${currentUserId}/totalCoins`] = newRedeemerTotal;
    updates[`/users/${currentUserId}/referralRedeemed`] = true;
    updates[`/users/${currentUserId}/codeRedeemedFrom`] = refUid;
    updates[`/users/${currentUserId}/lastActiveTimestamp`] = serverTimestamp();

    const newRedeemerTransactionRef = push(ref(db, `users/${currentUserId}/transactions`));
    updates[`/users/${currentUserId}/transactions/${newRedeemerTransactionRef.key}`] = {
         type: 'referral_bonus',
         amount: REDEEMER_BONUS,
         timestamp: serverTimestamp(),
         details: `Referral bonus from code: ${code}`
    };

    updates[`/users/${refUid}/totalCoins`] = newReferrerTotal;
    updates[`/users/${refUid}/referralCount`] = newReferrerCount;

     const newReferrerTransactionRef = push(ref(db, `users/${refUid}/transactions`));
     updates[`/users/${refUid}/transactions/${newReferrerTransactionRef.key}`] = {
          type: 'referrer_bonus',
          amount: REFERRER_BONUS,
          timestamp: serverTimestamp(),
          details: `Referrer bonus from user: ${currentUserData?.username || currentUserId}`
     };


    await update(ref(db), updates);
    console.log("DB updated for referral redemption.");

    return { newCoinsForRedeemer: newRedeemerTotal, referrerUid: refUid };
 }


inviteFriendBtn.addEventListener("click", () => {
    if (!auth.currentUser || !currentUsername) { showStatusMessage("Log in & complete profile.", "error"); return; }
    if (isProcessingAuth) return;
    updateInviteLinkDisplay();

     const userRef = ref(db, `users/${auth.currentUser.uid}`);
     update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on invite show:", e));


    showInterstitialAd(() => { console.log("Ad callback: Showing invite modal."); hideAllViewsAndModalsExcept(inviteModal); inviteModal.style.display = "flex"; });
});
closeInviteModal.addEventListener("click", () => { inviteModal.style.display = "none"; showMainMenu(); });
copyInviteCode.addEventListener("click", () => {
    const link = yourInviteLinkDisplay.textContent;
    if (link && link.startsWith('http') && currentUserInviteCode) {
        navigator.clipboard.writeText(link).then(() => showStatusMessage("Link copied!", "success")).catch(err => {
            showStatusMessage("Failed to copy.", "error"); console.error('Copy error:', err);
            try { const r=document.createRange(); r.selectNodeContents(yourInviteLinkDisplay); const s=window.getSelection(); s.removeAllRanges(); s.addRange(r); showStatusMessage("Link selected, copy manually.", "info", 4000); } catch (e) { console.error("Select fallback fail:", e); }
        });

         const userRef = ref(db, `users/${auth.currentUser.uid}`);
         update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on copy link:", e));


    } else { showStatusMessage("Link not ready.", "error"); console.warn("Invalid link copy attempt:", link); }
});
redeemCodeBtn.addEventListener("click", async () => {
    const code = redeemCodeInput.value.trim().toUpperCase();
    if (!code) { showStatusMessage("Enter code.", "error"); return; }
    const user = auth.currentUser;
    if (!user || !currentUsername) { showStatusMessage("Log in & complete profile.", "error"); return; }
    if (isProcessingAuth) return;
    redeemCodeBtn.disabled = true; showStatusMessage("Redeeming...", "info");

     const userRef = ref(db, `users/${user.uid}`);
     update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on redeem attempt:", e));


    try {
        const snap = await get(userRef);
        if (!snap.exists()) throw new Error("User data not found.");
        const userData = snap.val();

        const { newCoinsForRedeemer, referrerUid } = await redeemInviteCode(code, user.uid, userData);

        console.log(`User ${user.uid} redeemed from ${referrerUid}`);
        showStatusMessage(`Code redeemed! +${REDEEMER_BONUS} coins.`, "success", 5000);
        inviteModal.style.display = "none";
        redeemCodeInput.value = "";
        showMainMenu();

    } catch (e) {
        console.error("Redeem error:", e);
        let displayMessage = "Redemption failed.";
        if (e.message === "Invalid code.") displayMessage = "Invalid referral code.";
        else if (e.message === "Cannot redeem own code.") displayMessage = "Cannot redeem your own code.";
        else if (e.message === "Already redeemed code.") displayMessage = "You have already redeemed a code.";
        else if (e.message === "Referrer profile error.") displayMessage = "Referrer profile issue.";
        else displayMessage = "Error: " + e.message;


        showStatusMessage(displayMessage, "error", 4000);

    } finally { redeemCodeBtn.disabled = false; }
});

// --- Withdraw Logic ---
let selectedWithdrawOptionId = null;

function updateWithdrawalOptionStates() {
    const user = auth.currentUser;
    const isLoggedInAndProfileComplete = user && currentUsername;
    
    redeemOptionsDiv.innerHTML = ''; 

    for (const optionId in gameConfig.withdrawalOptions) {
        const option = gameConfig.withdrawalOptions[optionId];
        const button = document.createElement('button');
        button.classList.add('redeem-option');
        button.dataset.optionId = optionId;
        button.textContent = option.text;
        
        let isDisabled = false;
        let title = "";

        // UPDATED LOGIC: Checking PKR balance instead of Coins
        if (!isLoggedInAndProfileComplete) {
            isDisabled = true;
            title = "Log in & complete profile to withdraw.";
        } else if (option.isOneTime && hasWithdrawnOneTime[optionId]) {
            isDisabled = true;
            button.classList.add('redeemed-once');
            title = "This one-time option has already been used.";
        } else if (totalPKR < option.pkr) {
            isDisabled = true;
            title = `Need ${option.pkr - totalPKR} more Rs`;
            if (currentReferralCount < option.referralsNeeded) {
                title += ` and ${option.referralsNeeded - currentReferralCount} more refs`;
            }
        } else if (currentReferralCount < option.referralsNeeded) {
            isDisabled = true;
            title = `Need ${option.referralsNeeded - currentReferralCount} more refs (${currentReferralCount}/${option.referralsNeeded})`;
        } else {
            button.classList.add('available-option');
            title = `Meets requirements: ${option.pkr} Rs & ${option.referralsNeeded} refs`;
        }

        button.disabled = isDisabled;
        button.title = title;
        redeemOptionsDiv.appendChild(button);
    }

    redeemOptionsDiv.querySelectorAll('.redeem-option').forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) {
                showStatusMessage(button.title || "Requirements not met.", "error", 4000);
                return;
            }
            
            selectedWithdrawOptionId = button.dataset.optionId;
            const selectedOption = gameConfig.withdrawalOptions[selectedWithdrawOptionId];

            referralTaskDisplay.className = 'referralTaskDisplay task-complete';
            referralTaskDisplay.innerHTML = `<strong>Task:</strong> Invite ${selectedOption.referralsNeeded} friends <span class="status-icon">✔</span><br>(Completed: ${currentReferralCount}/${selectedOption.referralsNeeded} referrals)`;

            redeemOptionsDiv.style.display='none';
            redeemFormDiv.style.display='block';
            redeemFormDiv.querySelector('h3').textContent = `Redeem ${selectedOption.pkr} Rs`;
        });
    });
}


withdrawBtn.addEventListener("click", () => {
    if (!auth.currentUser || !currentUsername) { showStatusMessage("Log in & complete profile.", "error"); return; }
    if (isProcessingAuth) return;

     const userRef = ref(db, `users/${auth.currentUser.uid}`);
     update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on withdraw show:", e));

    showInterstitialAd(() => {
        console.log("Ad callback: Showing Withdraw modal.");
        updateWithdrawalOptionStates();
        redeemOptionsDiv.style.display="block"; redeemFormDiv.style.display="none";
        referralTaskDisplay.innerHTML = "";
        referralTaskDisplay.className = 'referralTaskDisplay';
        redeemDetailsForm.reset();
        accountHolderName.value = "";
        accountNumber.value = "";
        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => radio.checked = false);
        redeemSubmitBtn.disabled=false;
        redeemSubmitBtn.textContent="Submit Request";
        hideAllViewsAndModalsExcept(withdrawModal);
        withdrawModal.style.display="flex";
    });
});
closeWithdraw.addEventListener("click", () => { withdrawModal.style.display = "none"; showMainMenu(); });


redeemDetailsForm.addEventListener('submit', (e) => {
     e.preventDefault();
     const selectedOption = gameConfig.withdrawalOptions[selectedWithdrawOptionId];
     if (!selectedOption) {
         showStatusMessage("Error: No withdrawal option selected.", "error");
         return;
     }

     if (currentReferralCount < selectedOption.referralsNeeded) {
         showStatusMessage(`Referral task incomplete! Need ${selectedOption.referralsNeeded - currentReferralCount} more friends.`, "error", 5000);
         return;
     }

     const name = accountHolderName.value.trim();
     const number = accountNumber.value.trim();
     const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');

     if(!name || !number || !paymentMethodInput){ showStatusMessage("Please fill all details.", "error"); return; }
     if(!/^\d+$/.test(number)) { showStatusMessage("Account number is invalid.", "error"); return; }

     // UPDATED CHECK: Check totalPKR instead of totalCoins
     if(totalPKR < selectedOption.pkr){ 
         showStatusMessage(`Insufficient Rs balance. Need ${selectedOption.pkr} Rs. Swap coins first.`, "error", 5000); 
         withdrawModal.style.display = "none"; 
         return; 
     }

     const user=auth.currentUser; if(!user){ showStatusMessage("Authentication error.", "error"); withdrawModal.style.display="none"; return; }

     if (selectedOption.isOneTime && hasWithdrawnOneTime[selectedWithdrawOptionId]) {
          showStatusMessage("This one-time option has already been used.", "error", 4000);
          withdrawModal.style.display = "none";
          return;
     }

     const userRef = ref(db, `users/${user.uid}`);
     get(userRef).then(snap => {
         if (!snap.exists()) {
             showStatusMessage("Error processing request.", "error", 5000);
             return;
         }
         const currentData = snap.val();
         const currentTotalPKR = currentData.totalPKR ?? 0;
         const currentHasWithdrawnOneTime = currentData.hasWithdrawnOneTime ?? {};

          // Re-verify on server data
          if (currentTotalPKR < selectedOption.pkr) {
              showStatusMessage(`Insufficient Rs balance. Need ${selectedOption.pkr} Rs.`, "error", 5000);
              withdrawModal.style.display = "none";
              return;
          }
          if (selectedOption.isOneTime && currentHasWithdrawnOneTime[selectedWithdrawOptionId]) {
               showStatusMessage("This one-time option has already been used.", "error", 4000);
               withdrawModal.style.display = "none";
               return;
          }

         const method = paymentMethodInput.value; const timestamp = serverTimestamp();
         // UPDATED: Sending pkrAmount primarily
         const requestData = { uid: user.uid, email: user.email || "N/A", username: currentUsername || "N/A", pkrAmount: selectedOption.pkr, accountHolderName: name, accountNumber: number, paymentMethod: method, status: "pending", referralsAtRequest: currentReferralCount, timestamp: timestamp };

         const updates = {};
         // UPDATED: Deducting PKR instead of Coins
         const newTotalPKR = currentTotalPKR - selectedOption.pkr;
         const newRequestKey = push(ref(db, 'withdrawRequests')).key;

         updates[`/users/${user.uid}/totalPKR`] = newTotalPKR;
         updates[`/withdrawRequests/${newRequestKey}`] = requestData;
         updates[`/users/${user.uid}/lastActiveTimestamp`] = serverTimestamp();

         if (selectedOption.isOneTime) {
             updates[`/users/${user.uid}/hasWithdrawnOneTime/${selectedWithdrawOptionId}`] = true;
         }

         update(ref(db), updates).then(() => {
            showStatusMessage(`Request submitted successfully! Status: Pending.`, "success", 5000);
            withdrawModal.style.display = "none";
            showMainMenu();
         }).catch(err => {
            showStatusMessage("Submission failed: "+err.message, "error", 5000);
            console.error("Withdraw submission error:", err);
         });

     }).catch(err => {
          showStatusMessage("Error checking user data.", "error", 5000);
     });
});

swapCoinsBtnWithdraw.addEventListener('click', () => {
    withdrawModal.style.display = 'none'; 
    const user = auth.currentUser;
    if (!user || !currentUsername) {
         showStatusMessage("Log in & complete profile to swap.", "info");
         return;
     }
    hideAllViewsAndModalsExcept(swapModal); 
    updateSwapModalState();
    swapModal.style.display = 'flex';
});


// --- Info Modal ---
infoBtn.addEventListener("click", () => {
    const user = auth.currentUser;
    if (user && currentUsername) {
        const userRef = ref(db, `users/${user.uid}`);
        update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on info show:", e));
    }
    if (isProcessingAuth) return;


    showInterstitialAd(() => { console.log("Ad callback: Showing Info modal."); hideAllViewsAndModalsExcept(infoModal); infoModal.style.display = "flex"; });
});
closeInfo.addEventListener("click", () => { infoModal.style.display = "none"; showMainMenu(); });

// --- Logout ---
logoutBtn.addEventListener("click", () => { console.log("Logout clicked."); if (isProcessingAuth) return; setAuthProcessing(true); showStatusMessage("Logging out...", "info", 1500); signOut(auth).then(() => { console.log("SignOut ok."); showStatusMessage("Logged out.", "info"); }).catch((e) => { showStatusMessage("Logout error: "+e.message, "error"); console.error("Sign out error:", e); setAuthProcessing(false); }); });


// --- Spin Wheel Logic ---

function createWheelSegments() {
    wheelSvg.innerHTML = '';
    const radius = 200;
    const centerX = 200;
    const centerY = 200;
    const numSegments = spinWheelRewards.length;
    const degreesPerSegment = 360 / numSegments;


    spinWheelRewards.forEach((reward, index) => {
        const startAngle = index * degreesPerSegment;
        const endAngle = startAngle + degreesPerSegment;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const startAngleRad = startAngle * Math.PI / 180;
        const endAngleRad = endAngle * Math.PI / 180;

        const d = [
            `M ${centerX},${centerY}`,
            `L ${centerX + radius * Math.cos(startAngleRad)},${centerY + radius * Math.sin(startAngleRad)}`,
            `A ${radius},${radius} 0 0,1 ${centerX + radius * Math.cos(endAngleRad)},${centerY + radius * Math.sin(endAngleRad)}`,
            `Z`
        ].join(' ');

        path.setAttribute('d', d);
        path.setAttribute('fill', reward.color);
        path.setAttribute('stroke', '#333');
        path.setAttribute('stroke-width', '1');
        wheelSvg.appendChild(path);

        const angleForText = startAngle + degreesPerSegment / 2;
        const textRadius = radius * 0.75;

        const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        textGroup.setAttribute('transform', `rotate(${angleForText}, ${centerX}, ${centerY})`);

        const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textEl.setAttribute('x', centerX + textRadius);
        textEl.setAttribute('y', centerY);
        textEl.classList.add('wheel-text');
        textEl.textContent = reward.name;

         const textOutline = document.createElementNS("http://www.w3.org/2000/svg", "text");
         textOutline.setAttribute('x', centerX + textRadius);
         textOutline.setAttribute('y', centerY);
         textOutline.classList.add('wheel-text', 'wheel-text-outline');
         textOutline.textContent = reward.name;

        textGroup.appendChild(textOutline);
        textGroup.appendChild(textEl);
        wheelSvg.appendChild(textGroup);
    });

     const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
     centerCircle.setAttribute('cx', centerX);
     centerCircle.setAttribute('cy', centerY);
     centerCircle.setAttribute('r', 30);
     centerCircle.setAttribute('fill', 'none');
     centerCircle.setAttribute('stroke', '#eee');
     centerCircle.setAttribute('stroke-width', '4');
     wheelSvg.appendChild(centerCircle);
}


function calculateSpinResult(weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
        if (random < weights[i].weight) {
            return i;
        }
        random -= weights[i].weight;
    }
    return Math.floor(Math.random() * weights.length);
}

function animateWheel(targetIndex) {
    const numSegments = spinWheelRewards.length;
    const degreesPerSegment = 360 / numSegments;
    
    const targetSegmentStartAngle = targetIndex * degreesPerSegment;
    let rotationDegrees = -90 - targetSegmentStartAngle + 5 * 360;


    console.log(`Spinning to segment ${targetIndex} (${spinWheelRewards[targetIndex].name}). Target rotation: ${rotationDegrees.toFixed(2)}deg`);

    wheelSvg.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheelSvg.style.transform = `rotate(${rotationDegrees}deg)`;

    return new Promise(resolve => {
        setTimeout(() => {
             wheelSvg.style.transition = 'none';
             const normalizedRotation = (rotationDegrees % 360 + 360) % 360;
             wheelSvg.style.transform = `rotate(${normalizedRotation}deg)`;

             resolve(spinWheelRewards[targetIndex]);
        }, 5000);
    });
}

let cooldownIntervalId = null;
function updateSpinUI() {
     const user = auth.currentUser;
     const isLoggedIn = user !== null && currentUsername !== null;

     if (spinBtn) {
        if (isLoggedIn && mainMenu.style.display === 'flex') {
            spinBtn.style.display = 'flex';
        } else {
            spinBtn.style.display = 'none';
        }
        spinBtn.style.pointerEvents = isProcessingAuth ? 'none' : 'auto';
     }

     if (!isLoggedIn) {
         spinsLeftDisplay.textContent = 'Log in to spin';
         cooldownTimerDisplay.textContent = '';
         freeSpinBtn.disabled = true;
         buySpinBtn.disabled = true;
         spinStatusDisplay.textContent = '';
         if (cooldownIntervalId) clearInterval(cooldownIntervalId);
         cooldownIntervalId = null;
         return;
     }

     spinsLeftDisplay.textContent = `Spins left: ${spinsLeft}`;
     buySpinBtn.textContent = `Buy Spin (${spinBuyPrice} Coins)`;

     const now = Date.now();
     const timeSinceLastSpin = now - (lastSpinTime || 0);

     if (spinsLeft > 0) {
          freeSpinBtn.disabled = false;
          freeSpinBtn.textContent = `Spin Now!`;
          cooldownTimerDisplay.textContent = '';
          if (cooldownIntervalId) clearInterval(cooldownIntervalId);
          cooldownIntervalId = null;
          spinStatusDisplay.textContent = 'Ready to spin!';
     } else {
          const timeRemaining = spinCooldownMilliseconds - timeSinceLastSpin;
          freeSpinBtn.disabled = true;
          freeSpinBtn.textContent = 'Cooling Down';

         if (timeRemaining > 1000) {
              spinStatusDisplay.textContent = 'Cooldown active';

              if (!cooldownIntervalId) {
                   cooldownIntervalId = setInterval(() => {
                        updateSpinUI();
                   }, 1000);
              }
             const secondsRemaining = Math.ceil(timeRemaining / 1000);
             const hours = Math.floor(secondsRemaining / 3600);
             const minutes = Math.floor((secondsRemaining % 3600) / 60);
             const seconds = secondsRemaining % 60;
             cooldownTimerDisplay.textContent = `Next spin in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

         } else {
              spinStatusDisplay.textContent = 'Free spin available!';
              cooldownTimerDisplay.textContent = '';
              freeSpinBtn.disabled = false;
              freeSpinBtn.textContent = 'Get Free Spin!';
              if (cooldownIntervalId) clearInterval(cooldownIntervalId);
              cooldownIntervalId = null;
         }
     }


     if (totalCoins >= spinBuyPrice) {
         buySpinBtn.disabled = false;
         buySpinBtn.title = '';
     } else {
         buySpinBtn.disabled = true;
         buySpinBtn.title = `Need ${spinBuyPrice - totalCoins} more coins`;
     }

      if(isProcessingAuth) {
         if (!freeSpinBtn.dataset.preAuthDisabled) freeSpinBtn.dataset.preAuthDisabled = freeSpinBtn.disabled;
         if (!buySpinBtn.dataset.preAuthDisabled) buySpinBtn.dataset.preAuthDisabled = buySpinBtn.disabled;
          freeSpinBtn.disabled = true;
          buySpinBtn.disabled = true;
      } else {
          if (freeSpinBtn.dataset.preAuthDisabled !== undefined) {
               freeSpinBtn.disabled = (freeSpinBtn.dataset.preAuthDisabled === 'true');
               delete freeSpinBtn.dataset.preAuthDisabled;
          }
          if (buySpinBtn.dataset.preAuthDisabled !== undefined) {
               buySpinBtn.disabled = (buySpinBtn.dataset.preAuthDisabled === 'true');
               delete buySpinBtn.dataset.preAuthDisabled;
          }
      }
}

spinBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    const isGuest = !user || !currentUsername;

    if (isGuest) {
         showStatusMessage("Log in to use the Spin Wheel.", "info");
         return;
    }
    if (isProcessingAuth) return;


     const userRef = ref(db, `users/${auth.currentUser.uid}`);
     update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on spin button click:", e));


     showInterstitialAd(() => {
          console.log("Ad callback: Showing Spin Wheel modal.");
          hideAllViewsAndModalsExcept(spinWheelModal);

          createWheelSegments();
          updateSpinUI();
          spinWheelModal.style.display = 'flex';
     });
});

closeSpinWheelBtn.addEventListener('click', () => {
    spinWheelModal.style.display = 'none';
    wheelSvg.style.transition = 'none';
    wheelSvg.style.transform = 'rotate(0deg)';
    spinStatusDisplay.textContent = 'Ready to spin!';
    if (!gameStarted && !gameOver) showMainMenu();
    if (cooldownIntervalId) clearInterval(cooldownIntervalId);
    cooldownIntervalId = null;
});

freeSpinBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user || !currentUsername) {
        showStatusMessage("Log in to use the Spin Wheel.", "error");
        return;
    }
     if (isProcessingAuth) return;

    const now = Date.now();
    const timeSinceLastSpin = now - (lastSpinTime || 0);
    const timeRemaining = spinCooldownMilliseconds - timeSinceLastSpin;

    if (spinsLeft <= 0 && timeRemaining <= 1000) {
         if (freeSpinBtn.disabled) return;
         freeSpinBtn.disabled = true;
         freeSpinBtn.textContent = 'Getting Spin...';
         spinStatusDisplay.textContent = 'Claiming free spin...';
         console.log("Cooldown finished and 0 spins, attempting to grant a free spin...");

         const userRef = ref(db, `users/${user.uid}`);
         const updates = { spinsLeft: 1, lastSpinTime: serverTimestamp(), lastActiveTimestamp: serverTimestamp() };

         await update(userRef, updates)
             .then(() => {
                 console.log("Free spin granted successfully in DB. Listener will update UI.");
                 showStatusMessage("Free spin claimed! Click 'Spin Now!'", "success", 3000);
             })
             .catch(e => {
                 console.error("Error granting free spin in DB:", e);
                 showStatusMessage("Error claiming free spin. Try again.", "error");
                 freeSpinBtn.disabled = false; freeSpinBtn.textContent = 'Get Free Spin!';
             });
         return;
    }

    if (spinsLeft > 0) {
        if (freeSpinBtn.disabled) return;
        freeSpinBtn.disabled = true;
        buySpinBtn.disabled = true;
        spinStatusDisplay.textContent = 'Spinning...';
        playSound(spinStartSound);

        const winningIndex = calculateSpinResult(spinWheelRewards);
        const wonReward = spinWheelRewards[winningIndex];
        console.log("Calculated winning index:", winningIndex, wonReward);

        animateWheel(winningIndex).then(async () => {
            console.log("Spin animation finished. Won:", wonReward);
            playSound(spinWinSound);
            spinStatusDisplay.textContent = `You won: ${wonReward.name}!`;

            const userRef = ref(db, `users/${user.uid}`);
             get(userRef).then(snap => {
                 if (!snap.exists()) { console.error("User data missing after spin!"); showStatusMessage("Error processing win.", "error", 5000); updateSpinUI(); return; }
                 const currentData = snap.val();
                 const currentSpins = currentData.spinsLeft ?? 0;
                 const currentTotalCoins = currentData.totalCoins ?? 0;
                 const currentTotalPKR = currentData.totalPKR ?? 0;
                 const currentSpinCoinsEarned = currentData.totalSpinCoinsEarned ?? 0;
                 const currentSpinPkrEarned = currentData.totalSpinPkrEarned ?? 0;

                const updates = {};

                updates[`/users/${user.uid}/spinsLeft`] = (currentSpins > 0 ? currentSpins - 1 : 0);
                updates[`/users/${user.uid}/lastSpinTime`] = serverTimestamp();
                updates[`/users/${user.uid}/lastActiveTimestamp`] = serverTimestamp();

                if (wonReward.type === 'coins') {
                    updates[`/users/${user.uid}/totalCoins`] = currentTotalCoins + wonReward.amount;
                    updates[`/users/${user.uid}/totalSpinCoinsEarned`] = currentSpinCoinsEarned + wonReward.amount;
                } else if (wonReward.type === 'pkr') {
                    updates[`/users/${user.uid}/totalPKR`] = currentTotalPKR + wonReward.amount;
                    updates[`/users/${user.uid}/totalSpinPkrEarned`] = currentSpinPkrEarned + wonReward.amount;
                }

                 const newTransactionRef = push(ref(db, `users/${user.uid}/transactions`));
                 updates[`/users/${user.uid}/transactions/${newTransactionRef.key}`] = {
                      type: wonReward.type === 'coins' ? 'spin_coins' : 'spin_pkr',
                      amount: wonReward.amount,
                      timestamp: serverTimestamp(),
                      details: `Spin: Won ${wonReward.amount} ${wonReward.type === 'coins' ? 'Rs' : 'Rs'}`
                 };


                console.log(`Updating Firebase after spin: Decrement spins, set lastSpinTime, add ${wonReward.amount} ${wonReward.type}, update spin earnings, add transaction.`);
                update(ref(db), updates)
                    .then(() => {
                         console.log(`Spin winnings saved. Won ${wonReward.name}. Spins Left: ${currentSpins > 0 ? currentSpins - 1 : 0}. Transaction saved.`);
                         showStatusMessage(`Won ${wonReward.name}! Added ${wonReward.amount} ${wonReward.type}.`, "success", 5000);
                    })
                    .catch(e => {
                         console.error("Error saving spin winnings or transaction:", e);
                         showStatusMessage(`Error saving win: ${wonReward.name}. Reward not added.`, "error", 5000);
                    });
             }).catch(e => {
                 console.error("Error fetching user data before spin win update:", e);
                 showStatusMessage("Error processing win.", "error", 5000);
                 updateSpinUI();
             });
        });
    } else {
         showStatusMessage("No spins available.", "error", 2000);
         updateSpinUI();
    }
});


buySpinBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user || !currentUsername) return;
    if (isProcessingAuth || buySpinBtn.disabled) return;

    if (totalCoins < spinBuyPrice) {
        showStatusMessage(`Not enough coins. Need ${spinBuyPrice} coins.`, "error", 3000);
        updateSpinUI();
        return;
    }

    buySpinBtn.disabled = true;
    buySpinBtn.textContent = "Buying...";
    spinStatusDisplay.textContent = "Processing purchase...";
    showStatusMessage(`Buying spin for ${spinBuyPrice} coins...`, "info");

    const userRef = ref(db, `users/${user.uid}`);

     get(userRef).then(snap => {
         if (!snap.exists()) {
             console.error("User data missing when buying spin!");
             showStatusMessage("Error buying spin.", "error", 5000);
             buySpinBtn.disabled = false; buySpinBtn.textContent = `Buy Spin (${spinBuyPrice} Coins)`;
             updateSpinUI();
             return;
         }
         const currentData = snap.val();
         const currentTotalCoins = currentData.totalCoins ?? 0;
         const currentSpinsLeft = currentData.spinsLeft ?? 0;

         if (currentTotalCoins < spinBuyPrice) {
             console.warn("Insufficient coins on server during buy spin transaction check.");
             showStatusMessage(`Not enough coins. Need ${spinBuyPrice} coins.`, "error", 3000);
             buySpinBtn.disabled = false; buySpinBtn.textContent = `Buy Spin (${spinBuyPrice} Coins)`;
             updateSpinUI();
             return;
         }


        const updates = {};
        updates[`/users/${user.uid}/totalCoins`] = currentTotalCoins - spinBuyPrice;
        updates[`/users/${user.uid}/spinsLeft`] = currentSpinsLeft + 1;
        updates[`/users/${user.uid}/lastActiveTimestamp`] = serverTimestamp();

         const newTransactionRef = push(ref(db, `users/${user.uid}/transactions`));
          updates[`/users/${user.uid}/transactions/${newTransactionRef.key}`] = {
              type: 'buy_spin',
              amount: spinBuyPrice,
              timestamp: serverTimestamp(),
              details: `Bought spin for ${spinBuyPrice} Coins`
          };


        update(ref(db), updates)
            .then(() => {
                 console.log(`Spin purchased for ${spinBuyPrice} coins. Coins: -${spinBuyPrice}, Spins Left: ${currentSpinsLeft + 1}. Transaction saved.`);
                 showStatusMessage(`Spin purchased! ${spinBuyPrice} coins deducted.`, "success", 3000);
            })
            .catch(e => {
                 console.error("Error buying spin:", e);
                 showStatusMessage(`Error buying spin: ${e.message}`, "error", 5000);
                 buySpinBtn.disabled = false; buySpinBtn.textContent = `Buy Spin (${spinBuyPrice} Coins)`;
            });
     }).catch(e => {
         console.error("Error fetching user data before buy spin update:", e);
         showStatusMessage("Error buying spin.", "error", 5000);
         buySpinBtn.disabled = false; buySpinBtn.textContent = `Buy Spin (${spinBuyPrice} Coins)`;
     });
});

// --- Swap Modal Logic ---
topRightStatusContainer.addEventListener('click', () => { 
     const user = auth.currentUser;
     if (!user || !currentUsername) {
         showStatusMessage("Log in & complete profile to swap.", "info");
         return;
     }
     if (isProcessingAuth) return;


     const userRef = ref(db, `users/${user.uid}`);
     update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on swap show:", e));


     showInterstitialAd(() => {
        console.log("Ad callback: Showing Swap modal.");
         hideAllViewsAndModalsExcept(swapModal);
         updateSwapModalState();
         swapModal.style.display = 'flex';
     });
});

closeSwapModalBtn.addEventListener('click', () => {
     swapModal.style.display = 'none';
     if (!gameStarted && !gameOver) showMainMenu();
});

function updateSwapModalState() {
     const user = auth.currentUser;
     const isLoggedInAndProfileComplete = user && currentUsername;
     const swapCoinBlock = gameConfig.swapBlock;
     const swapPkrBlock = swapCoinBlock / gameConfig.coinToPkrRate;

     if (!isLoggedInAndProfileComplete) {
         if(swapCurrentCoinsSpan) swapCurrentCoinsSpan.textContent = '...';
         if(swapCurrentPkrSpan) swapCurrentPkrSpan.textContent = '...';
         if(swapToPkrBtn) {
              swapToPkrBtn.disabled = true;
              swapToPkrBtn.textContent = 'Log in to Swap';
              swapToPkrBtn.title = 'Log in & complete profile to swap.';
         }
         return;
     }

     if(swapCurrentCoinsSpan) swapCurrentCoinsSpan.textContent = totalCoins;
     if(swapCurrentPkrSpan) swapCurrentPkrSpan.textContent = totalPKR;

     const maxSwappableCoinsDisplay = Math.floor(totalCoins / swapCoinBlock) * swapCoinBlock;
     const maxSwappablePKRDisplay = (maxSwappableCoinsDisplay / swapCoinBlock) * swapPkrBlock;


     if (swapToPkrBtn) {
         if (maxSwappableCoinsDisplay >= swapCoinBlock) {
             swapToPkrBtn.disabled = false;
             swapToPkrBtn.textContent = `Swap ${maxSwappableCoinsDisplay} Coins`;
             swapToPkrBtn.title = `Swap ${maxSwappableCoinsDisplay} Coins for ${maxSwappablePKRDisplay} Rs`;
         } else {
             swapToPkrBtn.disabled = true;
             swapToPkrBtn.textContent = `Need ${swapCoinBlock} Coins`;
             swapToPkrBtn.title = `Need ${swapCoinBlock - totalCoins} more coins to swap.`;
         }
         if(isProcessingAuth) {
              if (!swapToPkrBtn.dataset.preAuthDisabled) swapToPkrBtn.dataset.preAuthDisabled = swapToPkrBtn.disabled;
              swapToPkrBtn.disabled = true;
         } else {
              if (swapToPkrBtn.dataset.preAuthDisabled !== undefined) {
                   swapToPkrBtn.disabled = (swapToPkrBtn.dataset.preAuthDisabled === 'true');
                   delete swapToPkrBtn.dataset.preAuthDisabled;
              }
         }
     }
}

swapToPkrBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user || !currentUsername || swapToPkrBtn.disabled) {
        showStatusMessage("Action not available. Log in?", "error");
        return;
    }
    if (isProcessingAuth) return;

     const swapCoinBlock = gameConfig.swapBlock;
     const coinsToSwapCheck = Math.floor(totalCoins / swapCoinBlock) * swapCoinBlock;
     if (coinsToSwapCheck < swapCoinBlock) {
        showStatusMessage(`Not enough coins to swap a block of ${swapCoinBlock}.`, "error", 3000);
        updateSwapModalState();
        return;
    }


    swapToPkrBtn.disabled = true;
     const processingText = `Processing Swap (${coinsToSwapCheck} Coins)...`;
    swapToPkrBtn.textContent = processingText;
    showStatusMessage("Processing swap...", "info");

    const userRef = ref(db, `users/${user.uid}`);

     get(userRef).then(snap => {
         if (!snap.exists()) {
             console.error("User data missing when swapping coins!");
             showStatusMessage("Error swapping coins.", "error", 5000);
             swapToPkrBtn.disabled = false; swapToPkrBtn.textContent = `Swap ${coinsToSwapCheck} Coins`;
             updateSwapModalState();
             return;
         }
         const currentData = snap.val();
         const currentTotalCoins = currentData.totalCoins ?? 0;
         const currentTotalPKR = currentData.totalPKR ?? 0;
         const currentTotalCoinsSwapped = currentData.totalCoinsSwapped ?? 0;
         const swapPkrBlock = swapCoinBlock / gameConfig.coinToPkrRate;

         const coinsToSwap = Math.floor(currentTotalCoins / swapCoinBlock) * swapCoinBlock;
         const pkrToAdd = (coinsToSwap / swapCoinBlock) * swapPkrBlock;

         if (coinsToSwap < swapCoinBlock) {
             console.warn("Insufficient coins on server during swap transaction check.");
             showStatusMessage(`Not enough coins to swap a block of ${swapCoinBlock}.`, "error", 3000);
             swapToPkrBtn.disabled = false; swapToPkrBtn.textContent = `Swap ${coinsToSwapCheck} Coins`;
             updateSwapModalState();
             return;
         }
         if (coinsToSwap === 0) {
              console.warn("Calculated coinsToSwap is 0 during transaction.");
              showStatusMessage("Swap amount error.", "error", 3000);
              swapToPkrBtn.disabled = false; swapToPkrBtn.textContent = `Swap ${coinsToSwapCheck} Coins`;
              updateSwapModalState();
              return;
         }


        const updates = {};
        updates[`/users/${user.uid}/totalCoins`] = currentTotalCoins - coinsToSwap;
        updates[`/users/${user.uid}/totalPKR`] = currentTotalPKR + pkrToAdd;
        updates[`/users/${user.uid}/totalCoinsSwapped`] = currentTotalCoinsSwapped + coinsToSwap;
        updates[`/users/${user.uid}/lastActiveTimestamp`] = serverTimestamp();

         const newTransactionRef = push(ref(db, `users/${user.uid}/transactions`));
         updates[`/users/${user.uid}/transactions/${newTransactionRef.key}`] = {
             type: 'swap_coins',
             amount: coinsToSwap,
             pkr_added: pkrToAdd,
             timestamp: serverTimestamp(),
             details: `Swapped ${coinsToSwap} Coins`
         };


        update(ref(db), updates)
            .then(() => {
                 console.log(`Coins swapped. Coins: -${coinsToSwap}, PKR: +${pkrToAdd}, Swapped: +${coinsToSwap}. Transaction saved.`);
                 showStatusMessage(`Successfully swapped ${coinsToSwap} Coins for ${pkrToAdd} Rs!`, "success", 5000);
                 swapModal.style.display = 'none';
                 showMainMenu();
            })
            .catch(e => {
                 console.error("Error swapping coins:", e);
                 showStatusMessage(`Swap failed: ${e.message}`, "error", 5000);
                 swapToPkrBtn.disabled = false;
                 swapToPkrBtn.textContent = `Swap ${coinsToSwapCheck} Coins`;
                 updateSwapModalState();
            });
     }).catch(err => {
         console.error("Error fetching user data before swap update:", err);
         showStatusMessage("Error checking user data.", "error", 5000);
         swapToPkrBtn.disabled = false; swapToPkrBtn.textContent = `Swap ${coinsToSwapCheck} Coins`;
     });
});


// --- Game Engine ---
const ctx = gameCanvas.getContext("2d");

// UPDATED: More robust resize function for PWA
function resizeCanvas() { 
    gameCanvas.width = window.innerWidth; 
    const bannerHeight = document.getElementById('bannerAdContainer')?.offsetHeight || 50; 
    // Ensure we are using viewport height correctly, fallback to window.innerHeight if visualViewport is unavailable
    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    gameCanvas.height = viewportHeight - bannerHeight; 
    
    // Reposition Mario if he's out of bounds after resize
    if (gameStarted && mario) {
        const groundY = gameCanvas.height - 50; 
        if (mario.y + mario.height >= groundY - 5) {
            mario.y = groundY - mario.height;
            mario.dy = 0;
            if (mario.isJumping) {
                mario.isJumping = false;
                canDoubleJump = false;
            }
        }
    } 
} 
window.addEventListener("resize", resizeCanvas);
// Add listener for visual viewport for mobile keyboards/bars
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', resizeCanvas);
}

const imagesToLoad = { background:"https://i.imgur.com/xZpZqGt.png", coin:"https://i.imgur.com/cMQ9X0d.png", platform:"https://i.imgur.com/06ptzal.png", pkr_icon: "https://i.imgur.com/W96jC2k.png" };
const gameImages = {}; let imagesLoadedCount = 0; let totalImagesToLoad = Object.keys(imagesToLoad).length;

function checkAllImagesLoaded() {
    imagesLoadedCount++;
    const percentage = totalImagesToLoad > 0 ? Math.round((imagesLoadedCount / totalImagesToLoad) * 100) : 100;
    const progressBar = document.getElementById('progressBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    if(progressBar) progressBar.style.width = percentage + '%';
    if(loadingPercentage) loadingPercentage.textContent = percentage + '%';

    console.log(`Image loaded (${imagesLoadedCount}/${totalImagesToLoad}) - ${percentage}%`);
    if (imagesLoadedCount >= totalImagesToLoad) {
        allImagesLoaded = true;
        console.log("All essential images loaded.");
        if(startBtn) startBtn.disabled = false;
        if(restartBtn) restartBtn.disabled = false;
        
        // Hide loading screen if stuck
        setTimeout(() => {
             if (loadingScreen.style.display === 'flex' && !isProcessingAuth) {
                  // Only auto-hide if not waiting for Auth
                  if(auth.currentUser && currentUsername) {
                      showMainMenu();
                  } else if (!auth.currentUser) {
                      hideAllViewsAndModalsExcept(googleSignInPanel);
                      googleSignInPanel.style.display = 'flex';
                  }
             }
        }, 1000);
    }
}

// Fallback button logic
forceStartBtn.addEventListener('click', () => {
    console.log("Forcing start...");
    allImagesLoaded = true;
    if(auth.currentUser) {
        showMainMenu();
    } else {
        hideAllViewsAndModalsExcept(googleSignInPanel);
        googleSignInPanel.style.display = 'flex';
    }
});

function loadInitialAssets() {
    console.log("Loading initial assets...");
    if (!db) {
        console.error("Firebase DB not initialized, cannot load assets.");
        showStatusMessage("Fatal error: Cannot load assets.", "error", 10000);
        if (startBtn) startBtn.disabled = true; if (restartBtn) restartBtn.disabled = true;
        // Enable force start just in case
        forceStartBtn.style.display = 'block';
        return;
    }

    const imageUrlsToLoad = new Set(Object.values(imagesToLoad));

    if (gameConfig && gameConfig.characters) {
        for (const charKey in gameConfig.characters) {
            const char = gameConfig.characters[charKey];
            imageUrlsToLoad.add(char.spriteUrl);
            imageUrlsToLoad.add(char.iconUrl);
        }
    }
    
    // NEW: Load all enemy sprites
    if (gameConfig && gameConfig.enemies) {
        for (const enemyKey in gameConfig.enemies) {
            const enemy = gameConfig.enemies[enemyKey];
            imageUrlsToLoad.add(enemy.spriteUrl);
        }
    }
    
    totalImagesToLoad = imageUrlsToLoad.size;
    imagesLoadedCount = 0;
    
    if (totalImagesToLoad === 0) {
        console.warn("No assets to load?");
        checkAllImagesLoaded(); // Force completion
        return;
    }

    imageUrlsToLoad.forEach(url => {
        if (gameImages[url]) { 
            // Already cached/loaded logic
            // totalImagesToLoad--; 
            // Better to reload to be safe or just check
        }
        gameImages[url] = new Image(); 
        gameImages[url].onload = checkAllImagesLoaded; 
        gameImages[url].onerror = () => { 
            console.error(`Failed load: ${url}`); 
            // Count it anyway so the game doesn't hang
            checkAllImagesLoaded(); 
            showStatusMessage(`Asset warning.`, "error", 2000); 
        };
        gameImages[url].src = url;
    });

    // Safety timeout: If assets take too long, show the "Stuck" button
    setTimeout(() => {
        if (!allImagesLoaded) {
            console.warn("Assets loading timed out. Showing force button.");
            forceStartBtn.style.display = 'block';
        }
    }, 8000);
}


function initGame() {
    if (!allImagesLoaded) { showStatusMessage("Assets loading...", "info"); return; }
    if (gameStarted) return;
    if (!selectedCharacter) {
        showStatusMessage("No character selected!", "error");
        showCharacterSelectionScreen();
        return;
    }
    console.log("Initializing game with character:", selectedCharacter.name);
    
    // Explicitly call resize before starting to ensure PWA dimensions are correct
    resizeCanvas();
    
    bgX = 0; platformX = 0;
    const groundY = gameCanvas.height - 50;
    mario = { 
        x: 60, 
        y: groundY - selectedCharacter.height, 
        width: selectedCharacter.width, 
        height: selectedCharacter.height, 
        dy: 0, 
        gravity: 1.8, // Increased for a less "floaty" feel
        jumpPower: selectedCharacter.jumpPower || -25, // Use configurable jump power
        doubleJumpPower: (selectedCharacter.jumpPower || -25) * 0.8, // Double jump is 80% of main jump
        isJumping: false, 
        onGround: true 
    };

    if (marioGifSprite) {
        marioGifSprite.src = selectedCharacter.spriteUrl;
        marioGifSprite.style.width = mario.width + 'px';
        marioGifSprite.style.height = mario.height + 'px';
        marioGifSprite.style.display = 'block';
    }

    obstacles = [];
    enemyGifContainer.innerHTML = ''; // Clear old enemy elements
    activeEnemyGifs = {};
    coins = [];
    speed = 6; score = 0;
    gameOver = false;
    gameStarted = true;
    lastJumpInputTime = 0;
    canDoubleJump = false;
    if(animationFrameId) cancelAnimationFrame(animationFrameId); animationFrameId = null;

    if (auth.currentUser && currentUsername) {
         gameStartTime = Date.now();
         console.log(`Game timer started for ${currentUsername}: ${gameStartTime}`);
    } else {
         gameStartTime = 0;
         console.log("Game timer not started for guest/incomplete profile.");
    }

    playBackgroundMusic();
    if (whatsappBtn) whatsappBtn.style.display = 'none';
    if (spinBtn) spinBtn.style.display = 'none';
    topRightStatusContainer.style.display = 'none';
    if (settingsBtn) settingsBtn.style.display = 'none';

    console.log("Game initialized. Starting loop.");
    gameLoop();
}

function drawBackground() { if (!gameImages[imagesToLoad.background]?.complete || gameImages[imagesToLoad.background].naturalHeight === 0) { ctx.fillStyle = '#60a5fa'; ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); return; }; bgX = (bgX - speed * 0.4) % gameImages[imagesToLoad.background].width; ctx.drawImage(gameImages[imagesToLoad.background], bgX, 0, gameImages[imagesToLoad.background].width, gameCanvas.height); ctx.drawImage(gameImages[imagesToLoad.background], bgX + gameImages[imagesToLoad.background].width, 0, gameImages[imagesToLoad.background].width, gameCanvas.height); }
function drawPlatform() { if (!gameImages[imagesToLoad.platform]?.complete || gameImages[imagesToLoad.platform].naturalHeight === 0) { ctx.fillStyle = '#E0A070'; ctx.fillRect(0, gameCanvas.height - 50, gameCanvas.width, 50); return; }; const groundY = gameCanvas.height - 50; platformX = (platformX - speed) % gameImages[imagesToLoad.platform].width; ctx.drawImage(gameImages[imagesToLoad.platform], platformX, groundY, gameImages[imagesToLoad.platform].width, 50); ctx.drawImage(gameImages[imagesToLoad.platform], platformX + gameImages[imagesToLoad.platform].width, groundY, gameImages[imagesToLoad.platform].width, 50); }

function drawMario() {
    if (!mario || !marioGifSprite) return;
    const canvasRect = gameCanvas.getBoundingClientRect();
    marioGifSprite.style.left = (canvasRect.left + window.scrollX + mario.x) + 'px';
    marioGifSprite.style.top = (canvasRect.top + window.scrollY + mario.y) + 'px';
}

// UPDATED enemy drawing logic for GIFs
function drawObstacles() {
    const canvasRect = gameCanvas.getBoundingClientRect();
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= speed;
        
        const gifEl = activeEnemyGifs[obs.id];
        if (gifEl) {
            gifEl.style.left = (canvasRect.left + window.scrollX + obs.x) + 'px';
            gifEl.style.top = (canvasRect.top + window.scrollY + obs.y) + 'px';
        }

        if (obs.x + obs.width < 0) {
            if (gifEl) {
                gifEl.remove();
            }
            delete activeEnemyGifs[obs.id];
            obstacles.splice(i, 1);
        }
    }
}

// UPDATED enemy spawning to handle multiple types
function spawnObstacles() {
    if (gameOver) return;
    const enemyTypes = Object.values(gameConfig.enemies || {});
    if (enemyTypes.length === 0) return;

    const bMin = 400, bMax = 700;
    const dF = Math.max(0.3, 1 - (score / 1000));
    const cMin = bMin * dF, cMax = bMax * dF;
    const dR = Math.max(100, cMax - cMin);
    const rD = cMin + Math.random() * dR;
    let lastX = -rD;
    if (obstacles.length > 0) {
        lastX = obstacles[obstacles.length - 1].x;
    }
    if (gameCanvas.width - lastX > rD && obstacles.length < 5) {
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const groundY = gameCanvas.height - 50;

        const newObstacle = {
            id: `obs_${Date.now()}_${Math.random()}`,
            x: gameCanvas.width + 10,
            y: groundY - enemyType.height,
            width: enemyType.width,
            height: enemyType.height,
            spriteUrl: enemyType.spriteUrl
        };
        obstacles.push(newObstacle);

        // Create and add the GIF element
        const gifEl = document.createElement('img');
        gifEl.src = newObstacle.spriteUrl;
        gifEl.className = 'enemy-gif-sprite';
        gifEl.style.width = newObstacle.width + 'px';
        gifEl.style.height = newObstacle.height + 'px';
        gifEl.style.display = 'block';
        enemyGifContainer.appendChild(gifEl);
        activeEnemyGifs[newObstacle.id] = gifEl;
    }
}

function spawnCoins() {
    if(!gameImages[imagesToLoad.coin]?.complete || gameImages[imagesToLoad.coin].naturalHeight === 0 || gameOver) return;
    const spawnChance = 0.014;
    const maxGroups = 3;
    if(coins.length < (maxGroups * 2) && Math.random() < spawnChance) {
        const groundY = gameCanvas.height - 50; let startY; const hChance=Math.random();
        if(hChance<0.5) startY=groundY-30; else if(hChance<0.85) startY=groundY-100-(Math.random()*40); else startY=groundY-160-(Math.random()*50);
        let coinCount = Math.floor(Math.random() * 2) + 1;
        let startX = gameCanvas.width + Math.random() * 150; const spacing = 45;
        for(let i=0; i<coinCount; i++) coins.push({x:startX+i*spacing,y:startY,width:25,height:25});
    }
}

// UPDATED to use coin multiplier
function drawCoinsAndCollect() {
    if (!gameImages[imagesToLoad.coin]?.complete || gameImages[imagesToLoad.coin].naturalHeight === 0 || !mario || gameOver) return;
    for (let i = coins.length - 1; i >= 0; i--) {
        let c = coins[i];
        c.x -= speed;
        ctx.drawImage(gameImages[imagesToLoad.coin], c.x - c.width / 2, c.y - c.height / 2, c.width, c.height);
        if (mario.x < c.x + c.width / 2 && mario.x + mario.width > c.x - c.width / 2 && mario.y < c.y + c.height / 2 && mario.y + mario.height > c.y - c.height / 2) {
            coins.splice(i, 1);
            score += (selectedCharacter.coinMultiplier || 1); // Use multiplier
            playSound(coinSound);
        } else if (c.x + c.width / 2 < 0) {
            coins.splice(i, 1);
        }
    }
}

function applyPhysics() { if(!mario || gameOver) return; mario.dy += mario.gravity; mario.y += mario.dy; const groundY = gameCanvas.height - 50; if (mario.y + mario.height >= groundY) { mario.y = groundY - mario.height; mario.dy = 0; mario.onGround = true; if(mario.isJumping) { mario.isJumping = false; canDoubleJump = false; } } else mario.onGround = false; if (mario.y < 0) { mario.y = 0; mario.dy = 0; } }
function checkCollision() { if(!mario || gameOver) return; for(let i = obstacles.length - 1; i >= 0; i--){ let obs = obstacles[i]; const mX=mario.x+5, mY=mario.y+5, mW=mario.width-10, mH=mario.height-10; const oX=obs.x+5, oY=obs.y+5, oW=obs.width-10, oH=obs.height-10; if (mX < oX + oW && mX + mW > oX && mY < oY + oH && mY + mH > oY) { console.log("Collision!"); gameOver = true; stopBackgroundMusic(); break; } } }

// UPDATED jump logic to use configurable power
function jump() {
    if (!gameStarted || gameOver || !mario) return;
    const now = Date.now();
    if (mario.isJumping && !mario.onGround && canDoubleJump && (now - lastJumpInputTime < doubleJumpWindow)) {
        mario.dy = mario.doubleJumpPower;
        canDoubleJump = false;
        lastJumpInputTime = 0;
        console.log("Double Jump!");
        playSound(jumpSound);
    } else if (mario.onGround) {
        mario.dy = mario.jumpPower;
        mario.isJumping = true;
        mario.onGround = false;
        canDoubleJump = true;
        lastJumpInputTime = now;
        console.log("First Jump!");
        playSound(jumpSound);
    }
}

function gameLoop() {
    if(gameOver || !gameStarted) { if (gameOver) handleGameOver(); return; }
    applyPhysics(); checkCollision(); if (gameOver) { handleGameOver(); return; }
    spawnObstacles(); spawnCoins();
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawBackground(); drawPlatform(); drawCoinsAndCollect();
    drawMario(); // Player GIF is positioned
    drawObstacles(); // Enemy GIFs are positioned
    
    ctx.fillStyle="#FFF";
    ctx.font="18px 'Press Start 2P'";
    ctx.textAlign="left"; ctx.textBaseline="top"; ctx.shadowColor='rgba(0,0,0,0.8)'; ctx.shadowBlur=5; ctx.shadowOffsetX=2; ctx.shadowOffsetY=2;
    ctx.fillText("Score: " + Math.floor(score), 25, 25);
    ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetX=0; ctx.shadowOffsetY=0;
    animationFrameId = requestAnimationFrame(gameLoop);
}
function handleGameOver() {
    if(animationFrameId) cancelAnimationFrame(animationFrameId);
    showGameOverMenu();
}

// --- Game Control Buttons ---
startBtn.addEventListener("click", () => {
    if (!allImagesLoaded) { showStatusMessage("Assets loading...", "info"); return; }
    if (gameStarted) return;
    showCharacterSelectionScreen();
});

// UPDATED: Restart Button Logic for Ad display
restartBtn.addEventListener("click", () => {
     if (!allImagesLoaded) { showStatusMessage("Assets error.", "error"); showMainMenu(); return; }
     if (gameStarted) return;
     
     // Increment retry counter
     retryCounter++;
     console.log("Retry counter:", retryCounter);

     // Check if it's the 3rd retry (3, 6, 9...)
     if (retryCounter % 3 === 0) {
         console.log("3rd retry detected. Showing ad.");
         showInterstitialAd(() => {
             console.log("Ad closed/skipped. Restarting game.");
             startGame();
         });
     } else {
         console.log("Regular retry. Starting game.");
         startGame();
     }
});

backMenuBtn.addEventListener("click", () => {
    console.log("Back to Menu clicked.");
    // Reset retry counter on exit to menu? Optional. Let's keep it running for session consistency.
    showInterstitialAd(() => { console.log("Ad callback: Showing main menu."); showMainMenu(); });
});

// --- UPDATED Character Selection Logic ---
function showCharacterSelectionScreen() {
    const user = auth.currentUser;
    if (!user && Object.keys(gameConfig.characters).length <= 1) {
        const freeCharId = Object.keys(gameConfig.characters).find(id => gameConfig.characters[id].price === 0);
        if (freeCharId) {
            selectedCharacter = gameConfig.characters[freeCharId];
            startGame();
            return;
        }
    }

    characterContainer.innerHTML = ''; 
    
    const characterEntries = Object.entries(gameConfig.characters);
    characterEntries.sort(([idA, charA], [idB, charB]) => {
        const isAMario = charA.name.toLowerCase().includes('mario boss');
        const isBMario = charB.name.toLowerCase().includes('mario boss');
        const isAFree = charA.price === 0;
        const isBFree = charB.price === 0;

        if (isAMario) return -1;
        if (isBMario) return 1;
        if (isAFree && !isBFree) return -1;
        if (isBFree && !isAFree) return 1;
        return charA.price - charB.price; 
    });


    for (const [charId, char] of characterEntries) {
        const isOwned = user ? userPurchasedCharacters.includes(charId) : char.price === 0;
        const canAfford = user ? totalCoins >= char.price : false;

        const card = document.createElement('div');
        card.className = `character-card`;
        card.dataset.charId = charId;
        
        if (selectedCharacter && selectedCharacter.name === char.name) {
            card.classList.add('selected');
        }

        let actionHtml;
        if (isOwned) {
            actionHtml = `<button class="game-btn char-action-btn select-btn" data-char-id="${charId}">SELECT</button>`;
        } else {
            actionHtml = `
                <div class="char-price-display">
                    <img src="${gameImages[imagesToLoad.coin].src}" alt="Coin">${char.price}
                </div>
                <button class="game-btn char-action-btn buy-btn" data-char-id="${charId}" ${!canAfford ? 'disabled' : ''}>
                   BUY
                </button>
            `;
        }

        card.innerHTML = `
            <div class="char-image-container">
                <img src="${char.iconUrl}" alt="${char.name}">
            </div>
            <div class="character-card-content">
                <div class="char-info">
                     <span class="char-name">${char.name}</span>
                     <p class="char-skill-badge">${char.skill || `x${char.coinMultiplier} Coins`}</p>
                </div>
                <div class="char-footer">
                    ${actionHtml}
                </div>
            </div>
        `;
        characterContainer.appendChild(card);
    }
    
    characterContainer.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            
            const charId = card.dataset.charId;
            const char = gameConfig.characters[charId];
            const isOwned = user ? userPurchasedCharacters.includes(charId) : char.price === 0;
            
            if(isOwned) {
                selectedCharacter = char;
                startGame();
            } else {
                showStatusMessage("You must buy this character first!", "info");
            }
        });
    });

    characterContainer.querySelectorAll('.select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const charId = e.currentTarget.dataset.charId;
            selectedCharacter = gameConfig.characters[charId];
            startGame();
        });
    });

    characterContainer.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const charId = e.currentTarget.dataset.charId;
            handleCharacterPurchase(charId);
        });
    });

    hideAllViewsAndModalsExcept(characterSelectionModal);
    characterSelectionModal.style.display = 'flex';
}

async function handleCharacterPurchase(charId) {
    const user = auth.currentUser;
    if (!user) {
        showStatusMessage("Log in to buy characters.", "error");
        return;
    }
    if (isProcessingAuth) return;

    const charToBuy = gameConfig.characters[charId];
    if (totalCoins < charToBuy.price) {
        showStatusMessage(`Not enough coins! Need ${charToBuy.price}.`, "error");
        return;
    }

    setAuthProcessing(true);
    showStatusMessage(`Purchasing ${charToBuy.name}...`, 'info');

    const userRef = ref(db, `users/${user.uid}`);
    
    try {
        const snapshot = await get(userRef);
        if (!snapshot.exists()) throw new Error("User data not found.");
        
        const userData = snapshot.val();
        const currentCoins = userData.totalCoins || 0;
        const purchased = userData.purchasedCharacters || [];

        if (currentCoins < charToBuy.price) {
            showStatusMessage("Purchase failed: Not enough coins.", "error");
            setAuthProcessing(false);
            return;
        }
        if (purchased.includes(charId)) {
            showStatusMessage("You already own this character!", "info");
            setAuthProcessing(false);
            return;
        }

        const updates = {};
        updates.totalCoins = currentCoins - charToBuy.price;
        updates.purchasedCharacters = [...purchased, charId];
        
        await update(userRef, updates);
        showStatusMessage(`${charToBuy.name} purchased!`, "success");
    } catch (error) {
        showStatusMessage("Purchase failed. Please try again.", "error");
        console.error("Character purchase error:", error);
    } finally {
        setAuthProcessing(false);
    }
}

// UPDATED: Start Game Logic with Ad Check
function startGame() {
    console.log("Start game sequence initiated.");
    const user = auth.currentUser;
    if (user && currentUsername) {
        const userRef = ref(db, `users/${user.uid}`);
        update(userRef, { lastActiveTimestamp: serverTimestamp() }).catch(e => console.error("Error updating last active timestamp on game start:", e));
    }
    
    // Logic: First launch is FREE (no ad). Subsequent launches via this method show ad.
    // However, user asked for: "pehle pehle pe sahi game play hona chahiye"
    // So if isFirstLaunch is true, skip ad.
    
    if (isFirstLaunch) {
        console.log("First launch detected. Skipping ad.");
        isFirstLaunch = false;
        hideAllViewsAndModalsExcept(gameCanvas);
        gameCanvas.style.display = 'block';
        initGame();
    } else {
        console.log("Not first launch. Showing interstitial ad.");
        showInterstitialAd(() => { 
            console.log("Ad callback: Starting game."); 
            hideAllViewsAndModalsExcept(gameCanvas);
            gameCanvas.style.display = 'block';
            initGame(); 
        });
    }
}

closeCharacterSelectionBtn.addEventListener('click', () => {
    characterSelectionModal.style.display = 'none';
    showMainMenu();
});


// --- Jump Listeners ---
document.addEventListener("keydown", (e) => { if ((e.code === "Space" || e.code === "ArrowUp") && gameStarted && !gameOver) { e.preventDefault(); jump(); } });
gameCanvas.addEventListener("click", (e) => { if (gameStarted && !gameOver) { e.preventDefault(); jump(); } });
gameCanvas.addEventListener("touchstart", (e) => { if (gameStarted && !gameOver) { e.preventDefault(); jump(); } }, { passive: false });

// --- PWA Installation Logic ---
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  console.log('`beforeinstallprompt` event was fired.');
  if (installPwaBtn) installPwaBtn.style.display = 'inline-flex';
});

installPwaBtn.addEventListener('click', handlePwaInstall);

async function handlePwaInstall() {
    if (!deferredInstallPrompt) {
        showStatusMessage("App already installed or not supported.", "info");
        return;
    }
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
        showStatusMessage("App installed successfully!", "success");
    } else {
        showStatusMessage("Installation cancelled.", "info");
    }
    deferredInstallPrompt = null;
    if (installPwaBtn) installPwaBtn.style.display = 'none';
}

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredInstallPrompt = null;
  if (installPwaBtn) installPwaBtn.style.display = 'none';
});

// --- Initial Setup on Page Load ---
async function initializeAppUI() {
    console.log("Initializing UI...");
    hideAllViewsAndModalsExcept();
    loadingScreen.style.display = 'flex';
    setAuthProcessing(true);

    await fetchGameConfig();
    applyGameConfig();
    loadInitialAssets();
    
    setAuthProcessing(false); updateSoundButton(); updateInviteLinkDisplay(); updateCoinPkrDisplay();
    if (startBtn) startBtn.disabled = true;
    if (restartBtn) restartBtn.disabled = true;

    console.log("Initial UI setup complete. Waiting for auth state...");
}
initializeAppUI();