

## Plan: Add all 4 uploaded icons to Platform Services cards

Now that all 4 icons have been provided, replace the Lucide `SimpleIcon` components with the uploaded 3D rendered images.

### Icon mapping
1. **Automated Escrow Payments** → `Money_Transfer_Arrow.png` (previously uploaded)
2. **Hybrid Contract Generation** → `Bill_Payment_Icon.png` (previously uploaded)
3. **Milestone Auto-Payments** → `Mobile_Banking_App.png` (just uploaded)
4. **Compliance & Verification** → `Safe_Login_Shield.png` (just uploaded)

### Changes

**1. Copy all 4 images to `src/assets/`**
- `Money_Transfer_Arrow.png`
- `Bill_Payment_Icon.png`
- `Mobile_Banking_App.png`
- `Safe_Login_Shield.png`

**2. Update `ServicesGrid.tsx`**
- Remove `SimpleIcon` component and Lucide icon imports (`Lock`, `Link`, `Zap`, `ShieldCheck`)
- Import the 4 images as ES6 modules from `@/assets/`
- Replace `iconComponents` array with image-based components: each renders an `<img>` tag inside the existing white `h-[240px]` container, sized appropriately (e.g. `w-28 h-28 object-contain`)
- Keep all card functionality (flip, drag scroll, animations) unchanged

