import { Box, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { useCallback, useMemo } from "react";
import { set, type ArrayOfObjectsInputProps, type ObjectSchemaType } from "sanity";

import { SocialLogo } from "./socialLogos";

type Profile = {
  _key: string;
  _type: "socialLink";
  label?: string;
  href?: string;
  icon?: string;
};

type Platform = { title: string; value: string };

function platformsOf(schemaType: ArrayOfObjectsInputProps["schemaType"]): Platform[] {
  const member = schemaType.of[0] as ObjectSchemaType | undefined;
  const iconField = member?.fields.find((field) => field.name === "icon");
  const list = (iconField?.type.options as { list?: Platform[] } | undefined)?.list;
  return list ?? [];
}

export function SocialProfilesInput(props: ArrayOfObjectsInputProps) {
  const { value, onChange, readOnly, schemaType } = props;
  const profiles = useMemo(() => (value ?? []) as Profile[], [value]);
  const platforms = useMemo(() => platformsOf(schemaType), [schemaType]);

  const write = useCallback(
    (platform: Platform, href: string) => {
      const existing = profiles.some((profile) => profile.icon === platform.value);

      if (existing) {
        onChange(
          set(
            profiles.map((profile) =>
              profile.icon === platform.value ? { ...profile, href, label: platform.title } : profile,
            ),
          ),
        );
      } else if (href.trim()) {
        onChange(
          set([
            ...profiles,
            {
              _key: platform.value,
              _type: "socialLink",
              label: platform.title,
              icon: platform.value,
              href,
            },
          ]),
        );
      }
    },
    [onChange, profiles],
  );

  const tidy = useCallback(
    (platform: Platform) => {
      const profile = profiles.find((entry) => entry.icon === platform.value);
      if (!profile) return;

      const href = (profile.href ?? "").trim();
      if (!href) {
        onChange(set(profiles.filter((entry) => entry.icon !== platform.value)));
      } else if (href !== profile.href) {
        write(platform, href);
      }
    },
    [onChange, profiles, write],
  );

  return (
    <Stack gap={3}>
      <Card border radius={2} overflow="hidden">
        {platforms.map((platform, index) => {
          const href = profiles.find((profile) => profile.icon === platform.value)?.href ?? "";
          const incomplete = href.trim() !== "" && !/^https?:\/\//.test(href.trim());

          return (
            <Card key={platform.value} borderTop={index > 0} paddingX={3} paddingY={2}>
              <Flex align="center" gap={3} style={{ minHeight: 44 }}>
                <Flex align="center" justify="center" style={{ width: 24 }}>
                  <SocialLogo name={platform.value} />
                </Flex>
                <Box style={{ width: 92 }}>
                  <Text size={1} weight="medium">
                    {platform.title}
                  </Text>
                </Box>
                <Box flex={1}>
                  <TextInput
                    fontSize={1}
                    type="url"
                    inputMode="url"
                    value={href}
                    disabled={readOnly}
                    placeholder="Paste your profile link"
                    aria-label={`${platform.title} profile link`}
                    onChange={(event) => write(platform, event.currentTarget.value)}
                    onBlur={() => tidy(platform)}
                  />
                </Box>
              </Flex>

              {incomplete ? (
                <Box paddingTop={2}>
                  <Card tone="caution" radius={2} padding={2}>
                    <Text size={1}>Paste the full link, starting with https://</Text>
                  </Card>
                </Box>
              ) : null}
            </Card>
          );
        })}
      </Card>

      <Text size={1} muted>
        Leave a box empty to hide that icon on your site.
      </Text>
    </Stack>
  );
}
