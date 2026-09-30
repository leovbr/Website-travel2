/* LocalStorage data layer — designed to be replaceable by Supabase later. */
const TravelStore = (() => {
  const KEY = 'nusa_travel_demo_v1';
  const defaults = { user:null, wishlist:[], bookings:[], reviews:[], profile:{name:'',email:'',photo:''} };
  const load = () => { try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}} };
  const save = state => localStorage.setItem(KEY,JSON.stringify(state));
  let state=load();
  const get=()=>JSON.parse(JSON.stringify(state));
  const set=patch=>{state={...state,...patch};save(state);return get()};
  const toggleWishlist=id=>{const wishlist=state.wishlist.includes(id)?state.wishlist.filter(x=>x!==id):[...state.wishlist,id];return set({wishlist}).wishlist};
  const addBooking=booking=>{const bookings=[...state.bookings,{...booking,id:crypto.randomUUID?.()||Date.now().toString(),createdAt:new Date().toISOString()}];return set({bookings}).bookings};
  const addReview=review=>{const reviews=[...state.reviews,{...review,id:crypto.randomUUID?.()||Date.now().toString(),createdAt:new Date().toISOString()}];return set({reviews}).reviews};
  const login=(name,email)=>set({user:{name,email},profile:{...state.profile,name,email}}).user;
  const logout=()=>set({user:null});
  const updateProfile=patch=>set({profile:{...state.profile,...patch},user:state.user?{...state.user,...patch}:state.user}).profile;
  const reset=()=>{state={...defaults};save(state);return get()};
  return {get,set,toggleWishlist,addBooking,addReview,login,logout,updateProfile,reset};
})();
window.TravelStore=TravelStore;
