// components/AeroHeader.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View, Text, Pressable, StyleSheet, ScrollView, FlatList,
  LayoutChangeEvent, Modal
} from "react-native";
import { AIRPORTS, Airport, groupAirports } from "@/constants/airports";

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

type Panel = null | "from" | "to" | "guests" | "menu";

function VDivider() { return <View style={styles.vDivider} />; }
function Caret() { return <View style={styles.caret} />; }
function SwapIcon() {
  return (
    <View style={styles.swapCircle}>
      <View style={[styles.swapArrow, { transform: [{ rotate: "45deg" }] }]} />
      <View style={[styles.swapArrow, { transform: [{ rotate: "-135deg" }] }]} />
    </View>
  );
}
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
  const [panel, setPanel] = useState<Panel>(null);
  const [trip, setTrip] = useState<"round" | "oneway">("round");

  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);

  const [guests, setGuests] = useState({ adult: 1, infant: 0, petSeat: 0, petCarrier: 0, service: 0 });

  // capture x positions of From/To fields so the dropdown anchors underneath
  const [fromX, setFromX] = useState(180);
  const [toX, setToX] = useState(520);
  const containerPadLeft = 24; // must match styles.inner paddingLeft

  const grouped = useMemo(() => groupAirports(AIRPORTS), []);

  function swap() {
    setOrigin(destination);
    setDestination(origin);
  }

  const totalGuests =
    guests.adult + guests.infant + guests.petSeat + guests.petCarrier + guests.service;

  return (
    <View style={styles.wrap}>
      {/* LEFT EDGE COLOR BAR */}
      <View style={styles.leftEdgeBar}>
        {STRIPES.map((c, i) => <View key={i} style={{ flex: 1, backgroundColor: c }} />)}
      </View>

      <View style={styles.inner}>
        {/* left */}
        <View style={styles.leftGroup}>
          <Logo />
          <VDivider />
        </View>

        {/* middle (scrolls on small width) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.center}>
          {/* FROM */}
          <Pressable
            onLayout={(e: LayoutChangeEvent) => setFromX(Math.round(e.nativeEvent.layout.x))}
            onPress={() => setPanel(p => (p === "from" ? null : "from"))}
            style={[styles.field, { minWidth: 300 }]}
          >
            <Text style={styles.fieldLabel}>From</Text>
            <View style={styles.fieldRow}>
              <View style={{ flexShrink: 1 }}>
                <Text numberOfLines={1} style={styles.fieldValue}>
                  {origin ? origin.city : "Origin"}
                </Text>
                <Text numberOfLines={1} style={styles.subAirport}>
                  {origin ? origin.name : "Choose origin airport"}
                </Text>
              </View>
              <Caret />
            </View>
          </Pressable>

          <Pressable onPress={swap} style={styles.swapBtnWrap}>
            <SwapIcon />
          </Pressable>

          {/* TO */}
          <Pressable
            onLayout={(e: LayoutChangeEvent) => setToX(Math.round(e.nativeEvent.layout.x))}
            onPress={() => setPanel(p => (p === "to" ? null : "to"))}
            style={[styles.field, { minWidth: 300 }]}
          >
            <Text style={styles.fieldLabel}>To</Text>
            <View style={styles.fieldRow}>
              <View style={{ flexShrink: 1 }}>
                <Text numberOfLines={1} style={styles.fieldValue}>
                  {destination ? destination.city : "Destination"}
                </Text>
                <Text numberOfLines={1} style={styles.subAirport}>
                  {destination ? destination.name : "Choose destination airport"}
                </Text>
              </View>
              <Caret />
            </View>
          </Pressable>

          <VDivider />

          {/* Guests */}
          <Pressable onPress={() => setPanel(p => (p === "guests" ? null : "guests"))} style={styles.guests}>
            <Text style={styles.fieldLabel}>Guests</Text>
            <View style={styles.guestsRow}>
              <Text style={styles.guestsNum}>{Math.max(1, totalGuests)}</Text>
              <Text style={styles.guestsMeta}>
                {guests.adult} Adult{guests.adult !== 1 ? "s" : ""}
              </Text>
              <Caret />
            </View>
          </Pressable>

          <VDivider />

          {/* trip toggle */}
          <Pressable
            onPress={() => setTrip(t => (t === "round" ? "oneway" : "round"))}
            style={styles.tripWrap}
          >
            <View style={[styles.tripDot, { backgroundColor: trip === "round" ? COLORS.accent : "rgba(255,255,255,0.2)" }]} />
            <View>
              <Text style={styles.tripTop}>{trip === "round" ? "Round Trip" : "One Way"}</Text>
              <Text style={styles.tripSub}>{trip === "round" ? "One Way" : "Round Trip"}</Text>
            </View>
          </Pressable>
        </ScrollView>

        {/* right */}
        <View style={styles.rightGroup}>
          <CtaButton />
          <Pressable onPress={() => setPanel(p => (p === "menu" ? null : "menu"))} style={styles.menu}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </Pressable>
        </View>
      </View>

      {/* PANELS */}
      <DropdownAirports
        open={panel === "from"}
        onClose={() => setPanel(null)}
        left={containerPadLeft + fromX}
        title="From"
        selected={origin?.code}
        onSelect={(a) => { setOrigin(a); setPanel(null); }}
        grouped={grouped}
      />
      <DropdownAirports
        open={panel === "to"}
        onClose={() => setPanel(null)}
        left={containerPadLeft + toX}
        title="To"
        selected={destination?.code}
        onSelect={(a) => { setDestination(a); setPanel(null); }}
        grouped={grouped}
      />
      <GuestsPanel
        open={panel === "guests"}
        onClose={() => setPanel(null)}
        value={guests}
        onChange={setGuests}
      />
      <SideMenu open={panel === "menu"} onClose={() => setPanel(null)} />
    </View>
  );
}

/* =========================== PANELS =========================== */

function DropdownAirports({
  open, onClose, left, title, grouped, onSelect, selected,
}: {
  open: boolean; onClose: () => void; left: number; title: string;
  grouped: { title: string; items: Airport[] }[];
  selected?: string; onSelect: (a: Airport) => void;
}) {
  if (!open) return null;
  return (
    <View style={styles.overlayWrap} pointerEvents="box-none">
      {/* backdrop click */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={[styles.dropdown, { left }]}>
        <Text style={styles.dropdownTitle}>{title}</Text>
        <FlatList
          data={grouped}
          keyExtractor={(g) => g.title}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.groupTitle}>{item.title}</Text>
              {item.items.map(a => (
                <Pressable
                  key={a.code}
                  onPress={() => onSelect(a)}
                  style={styles.airportRow}
                >
                  <Text style={styles.airportCity}>✈︎  {a.name}</Text>
                  <Text style={styles.airportCode}>{a.code}</Text>
                </Pressable>
              ))}
              <View style={styles.rowDivider} />
            </View>
          )}
        />
      </View>
    </View>
  );
}

function CounterRow({
  label, sub, value, setValue,
}: {
  label: string; sub?: string; value: number; setValue: (v: number) => void;
}) {
  return (
    <View style={styles.counterRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.counterLabel}>{label}</Text>
        {sub ? <Text style={styles.counterSub}>{sub}</Text> : null}
      </View>
      <View style={styles.counterBtns}>
        <Pressable onPress={() => setValue(Math.max(0, value - 1))} style={styles.counterBtn}>
          <Text style={styles.counterBtnTxt}>–</Text>
        </Pressable>
        <Text style={styles.counterValue}>{value}</Text>
        <Pressable onPress={() => setValue(value + 1)} style={styles.counterBtn}>
          <Text style={styles.counterBtnTxt}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function GuestsPanel({
  open, onClose, value, onChange,
}: {
  open: boolean; onClose: () => void;
  value: { adult: number; infant: number; petSeat: number; petCarrier: number; service: number };
  onChange: (v: { adult: number; infant: number; petSeat: number; petCarrier: number; service: number }) => void;
}) {
  if (!open) return null;
  return (
    <View style={styles.overlayWrap} pointerEvents="box-none">
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.guestsPanel}>
        <Text style={styles.gTitle}>Guests</Text>
        <CounterRow
          label="Adult" sub="Ages 2+"
          value={value.adult} setValue={(n) => onChange({ ...value, adult: Math.max(1, n) })}
        />
        <View style={styles.sepline} />
        <CounterRow label="Infants" value={value.infant} setValue={(n) => onChange({ ...value, infant: n })} />
        <View style={styles.sepline} />
        <CounterRow
          label="Pet (In Seat)" sub="An extra seat for your pet"
          value={value.petSeat} setValue={(n) => onChange({ ...value, petSeat: n })}
        />
        <View style={styles.sepline} />
        <CounterRow
          label="Pet (In Carrier)"
          sub="Max 20 in x 12 in x 9 in, <20 lbs, under the seat"
          value={value.petCarrier} setValue={(n) => onChange({ ...value, petCarrier: n })}
        />
        <View style={styles.sepline} />
        <CounterRow
          label="Service Animal*"
          sub="Must fit within passenger’s foot space"
          value={value.service} setValue={(n) => onChange({ ...value, service: n })}
        />
        <Pressable onPress={onClose} style={styles.doneBtn}>
          <Text style={styles.doneTxt}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

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

  leftGroup: { flexDirection: "row", alignItems: "center" },
  center: { flexDirection: "row", alignItems: "center", gap: 20, paddingRight: 16 },
  rightGroup: { flexDirection: "row", alignItems: "center", gap: 18 },

  logoWrap: { flexDirection: "row", alignItems: "center", gap: 14, marginLeft: 16 },
  logoBox: { width: 16, height: 32, overflow: "hidden", borderRadius: 2, flexDirection: "row" },
  logoStripe: { width: 3, height: "100%" },
  logoText: { color: COLORS.white, fontSize: 22, fontWeight: "600" },

  vDivider: { width: 1, height: 44, backgroundColor: COLORS.divider, marginLeft: 16, marginRight: 8 },

  field: { paddingVertical: 6, minWidth: 180 },
  fieldLabel: { color: COLORS.label, fontSize: 12, marginBottom: 6 },
  fieldRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  fieldValue: { color: COLORS.text, fontSize: 34, lineHeight: 34, fontWeight: "500", letterSpacing: 0.1 },
  subAirport: { color: COLORS.label, marginTop: 6, maxWidth: 420 },

  caret: {
    width: 8, height: 8, borderRightWidth: 1.6, borderBottomWidth: 1.6,
    borderColor: "rgba(255,255,255,0.9)", transform: [{ rotate: "45deg" }], marginTop: 6, opacity: 0.95,
  },

  swapBtnWrap: { paddingHorizontal: 2, paddingVertical: 4 },
  swapCircle: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.soft,
    alignItems: "center", justifyContent: "center", position: "relative",
  },
  swapArrow: {
    position: "absolute", width: 10, height: 10, borderRightWidth: 1.8, borderTopWidth: 1.8,
    borderColor: COLORS.dim, borderRadius: 1,
  },

  guests: { paddingVertical: 6, minWidth: 130 },
  guestsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  guestsNum: { color: COLORS.text, fontSize: 34, lineHeight: 34, fontWeight: "500" },
  guestsMeta: { color: COLORS.label, marginTop: 6 },

  tripWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: COLORS.soft, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
  },
  tripDot: { width: 16, height: 16, borderRadius: 8 },
  tripTop: { color: COLORS.blue, fontSize: 14, fontWeight: "600", marginBottom: 2 },
  tripSub: { color: COLORS.label, fontSize: 12 },

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

  /* overlay/panels */
  overlayWrap: { position: "absolute", left: 0, right: 0, top: 68, bottom: 0 }, // 68≈ header height
  dropdown: {
    position: "absolute", top: 0, width: 520, bottom: undefined,
    backgroundColor: "#0B0B0B", borderRadius: 10, overflow: "hidden",
    borderWidth: 1, borderColor: COLORS.divider,
  },
  dropdownTitle: { color: COLORS.label, fontSize: 12, paddingHorizontal: 12, paddingVertical: 10, borderBottomColor: COLORS.divider, borderBottomWidth: 1 },
  groupTitle: { color: COLORS.label, fontSize: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  airportRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.softer,
    justifyContent: "space-between",
  },
  airportCity: { color: COLORS.text, fontSize: 16 },
  airportCode: { color: COLORS.label, fontSize: 14 },
  rowDivider: { height: 1, backgroundColor: COLORS.divider, marginLeft: 16, marginRight: 16 },

  guestsPanel: {
    position: "absolute", right: 12, top: 0, width: 520,
    backgroundColor: "#0B0B0B", borderRadius: 10, borderWidth: 1, borderColor: COLORS.divider,
    padding: 16,
  },
  gTitle: { color: COLORS.label, fontSize: 12, marginBottom: 8 },
  counterRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  counterLabel: { color: COLORS.text, fontSize: 22, fontWeight: "600" },
  counterSub: { color: COLORS.label, marginTop: 6 },
  counterBtns: { flexDirection: "row", alignItems: "center", gap: 16 },
  counterBtn: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: COLORS.divider,
    alignItems: "center", justifyContent: "center",
  },
  counterBtnTxt: { color: COLORS.text, fontSize: 20, fontWeight: "600" },
  counterValue: { color: COLORS.text, fontSize: 18, minWidth: 18, textAlign: "center" },
  sepline: { height: 1, backgroundColor: COLORS.divider },
  doneBtn: {
    marginTop: 14, alignSelf: "flex-end",
    backgroundColor: COLORS.softer, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8,
  },
  doneTxt: { color: COLORS.white },

  menuBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sideMenu: {
    position: "absolute", top: 0, right: 0, width: 320, bottom: 0,
    backgroundColor: "#0B0B0B", paddingTop: 80, paddingHorizontal: 24,
    borderLeftWidth: 1, borderLeftColor: COLORS.divider,
  },
  sideItem: { paddingVertical: 16 },
  sideItemTxt: { color: COLORS.text, fontSize: 18 },
});
