// components/AeroHeader.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";

const COLORS = {
  bg: "#000",
  border: "#1F1F1F",
  divider: "#262626",
  soft: "rgba(255,255,255,0.08)",
  softer: "rgba(255,255,255,0.06)",
  text: "rgba(255,255,255,0.86)",
  label: "rgba(255,255,255,0.55)",
  dim: "rgba(255,255,255,0.72)",
  white: "#fff",
  accent: "#FF7A00",
  blue: "#4CC3FF",
};

const STRIPES = ["#8B0E0E", "#C23A05", "#FF7A00", "#F2B06B", "#FFD7A8"];
function Logo() {
  return (
    <View style={styles.logoWrap}>
      {/* brand stripes box */}
      <View style={styles.logoBox}>
        {STRIPES.map((c, i) => <View key={i} style={[styles.logoStripe, { backgroundColor: c }]} />)}
      </View>
      <Text style={styles.logoText}>Aero</Text>
    </View>
  );
}

function CtaButton() {
  return (
    <Pressable style={styles.cta}>
      <View style={styles.arrowHead} />
    </Pressable>
  );
}

export default function AeroHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <View style={styles.leftEdgeBar}>
        {STRIPES.map((c, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: c }} />
        ))}
      </View>

      <View style={styles.inner}>
        <Logo />
        <View style={styles.nav}>
          {["Experience", "Fleet", "Our Story", "Contact Us"].map((t) => (
            <Pressable key={t} style={styles.navItem}>
              <Text style={styles.navTxt}>{t}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.rightGroup}>
          <Pressable style={styles.login}>
            <Text style={styles.loginTxt}>Login</Text>
          </Pressable>
          <CtaButton />
          <Pressable onPress={() => setMenuOpen(true)} style={styles.menu}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </Pressable>
        </View>
      </View>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

/* =========================== PANELS =========================== */

function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.menuBackdrop} onPress={onClose} />
      <View style={styles.sideMenu}>
        {["Login", "Book Seats", "Experience", "Fleet", "Our Story", "Contact Us"].map((t) => (
          <Pressable key={t} style={styles.sideItem}><Text style={styles.sideItemTxt}>{t}</Text></Pressable>
        ))}
      </View>
    </Modal>
  );
}

/* =========================== STYLES =========================== */

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  leftEdgeBar: {
    position: "absolute", left: 0, top: 0, bottom: 0, width: 12, flexDirection: "column",
  },
  inner: {
    maxWidth: 1680,
    width: "100%",
    alignSelf: "center",
    paddingLeft: 24, // <- used in anchor calc
    paddingRight: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  nav: { flexDirection: "row", alignItems: "center", gap: 32, marginLeft: 32 },
  navItem: {},
  navTxt: { color: COLORS.text, fontSize: 18 },

  rightGroup: { flexDirection: "row", alignItems: "center", gap: 18 },
  login: {},
  loginTxt: { color: COLORS.text, fontSize: 16 },

  logoWrap: { flexDirection: "row", alignItems: "center", gap: 14, marginLeft: 16 },
  logoBox: { width: 16, height: 32, overflow: "hidden", borderRadius: 2, flexDirection: "row" },
  logoStripe: { width: 3, height: "100%" },
  logoText: { color: COLORS.white, fontSize: 22, fontWeight: "600" },

  cta: {
    backgroundColor: COLORS.accent, height: 56, width: 112,
    borderRadius: 8, alignItems: "center", justifyContent: "center",
  },
  arrowHead: {
    width: 0, height: 0, borderTopWidth: 10, borderBottomWidth: 10, borderLeftWidth: 18,
    borderTopColor: "transparent", borderBottomColor: "transparent", borderLeftColor: COLORS.white,
  },

  menu: { gap: 6, padding: 6 },
  menuLine: { width: 22, height: 2, backgroundColor: "rgba(255,255,255,0.92)" },

  menuBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sideMenu: {
    position: "absolute", top: 0, right: 0, width: 320, bottom: 0,
    backgroundColor: "#0B0B0B", paddingTop: 80, paddingHorizontal: 24,
    borderLeftWidth: 1, borderLeftColor: COLORS.divider,
  },
  sideItem: { paddingVertical: 16 },
  sideItemTxt: { color: COLORS.text, fontSize: 18 },
});
