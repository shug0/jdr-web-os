"use client";

import {
  User,
  Briefcase,
  Shield,
  Eye,
  MessageSquare,
  Sparkles,
  Key,
  Heart,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Palette,
  Award,
  AlignJustify,
} from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { usePnjStore } from "@/lib/store/pnj-store";
import { PnjDescription } from "./pnj-description";
import { PnjNameGenerator } from "./pnj-name-generator";
import { AttributeCard } from "./attribute-card";
import { SectionHeader } from "./section-header";
import { getExperienceColor } from "../utils/experience-utils";

export function PnjCard() {
  const pnj = usePnjStore((state) => state.currentPnj);
  const regenerateField = usePnjStore((state) => state.regenerateField);

  if (!pnj) return null;

  return (
    <div className="space-y-6">
      {/* Identité Section */}
      <div className="relative">
        <SectionHeader
          title="Identité"
          icon={<User className="h-5 w-5" />}
          onRegenerate={() => regenerateField("identite")}
          regenerateTooltip="Régénérer l'identité"
        />

        <Card className="mb-4">
          <CardContent className="">
            <PnjNameGenerator />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AttributeCard
            label="Race"
            value={pnj.race}
            icon={<User className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("race")}
          />

          <AttributeCard
            label="Classe"
            value={pnj.classe}
            icon={<Shield className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("classe")}
          />

          <AttributeCard
            label="Profession"
            value={pnj.profession}
            icon={<Briefcase className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("profession")}
          />

          <AttributeCard
            label="Alignement"
            value={pnj.alignement}
            icon={<AlignJustify className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("alignement")}
          />

          <AttributeCard
            label="Niveau d'expérience"
            value={pnj.experience}
            icon={<Award className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("experience")}
            className="md:col-span-2"
            valueClassName={
`${getExperienceColor(pnj.experience)
                .replace("bg-", "text-")
                .replace("-100", "-600")} font-medium`
            }
          />
        </div>
      </div>

      {/* Appearance and Behavior Section */}
      <div className="relative">
        <SectionHeader
          title="Apparence et Comportement"
          icon={<Eye className="h-5 w-5" />}
          onRegenerate={() => regenerateField("apparenceComportement")}
          regenerateTooltip="Régénérer l'apparence et le comportement"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AttributeCard
            label="Apparence"
            value={pnj.apparence}
            icon={<Eye className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("apparence")}
          />

          <AttributeCard
            label="Manie"
            value={pnj.manie}
            icon={<MessageSquare className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("manie")}
          />

          <AttributeCard
            label="Trait d'interaction"
            value={pnj.traitInteraction}
            icon={<MessageSquare className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("traitInteraction")}
          />

          <AttributeCard
            label="Talent"
            value={pnj.talent}
            icon={<Sparkles className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("talent")}
          />
        </div>
      </div>

      {/* Personality Section */}
      <div className="relative">
        <SectionHeader
          title="Personnalité"
          icon={<Heart className="h-5 w-5" />}
          onRegenerate={() => regenerateField("personnalite")}
          regenerateTooltip="Régénérer la personnalité"
        />

        <div className="grid grid-cols-1 gap-4">
          <AttributeCard
            label="Défaut ou secret"
            value={pnj.defautSecret}
            icon={<Key className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("defautSecret")}
          />

          <AttributeCard
            label="Idéal"
            value={pnj.ideal}
            icon={<Lightbulb className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("ideal")}
          />

          <AttributeCard
            label="Lien"
            value={pnj.lien}
            icon={<Heart className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("lien")}
          />

          <AttributeCard
            label="Couleur préférée"
            value={pnj.couleurPreferee}
            icon={<Palette className="h-3.5 w-3.5" />}
            onRegenerate={() => regenerateField("couleurPreferee")}
          />
        </div>
      </div>

      {/* Characteristics Section */}
      <div className="relative">
        <SectionHeader
          title="Caractéristiques"
          icon={<TrendingUp className="h-5 w-5" />}
          onRegenerate={() => regenerateField("caracteristiques")}
          regenerateTooltip="Régénérer les caractéristiques"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AttributeCard
            label="Caractéristique élevée"
            value={pnj.caracteristiqueElevee}
            icon={<TrendingUp className="h-3.5 w-3.5 text-success" />}
            onRegenerate={() => regenerateField("caracteristiqueElevee")}
            valueClassName="text-success font-medium"
          />

          <AttributeCard
            label="Caractéristique basse"
            value={pnj.caracteristiqueBasse}
            icon={<TrendingDown className="h-3.5 w-3.5 text-destructive" />}
            onRegenerate={() => regenerateField("caracteristiqueBasse")}
            valueClassName="text-destructive font-medium"
          />
        </div>
      </div>

      {/* Description Section */}
      <PnjDescription pnj={pnj} />
    </div>
  );
}
