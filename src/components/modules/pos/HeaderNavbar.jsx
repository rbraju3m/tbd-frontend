import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Progress,
  Title,
  Group,
  ActionIcon,
  Text,
  Badge,
  Flex,
  Stack,
  Center,
  ScrollArea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";

function HeaderNavbar(props) {
  const { tables, setTables, tableId, setTableId } = props;
  const { t, i18n } = useTranslation();

  const clicked = (id) => {
    setTableId(id);
  };

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Box style={{ position: "relative" }}>
        <ScrollArea
          type="never"
          mt={"8"}
          pl={"sm"}
          pr={"sm"}
          viewportRef={scrollRef}
          onScrollPositionChange={handleScroll}
        >
          <Group justify="flex-start" align="flex-start" gap="xs" wrap="nowrap">
            {tables.map((table) => (
              <Box
                onClick={() => {
                    clicked(table.id);
                }}
                key={table.id}
                style={{
                  position: "relative",
                  width: "120px",
                  cursor: "pointer",
                }}
              >
                <Badge
                  mt={"14"}
                  size="xs"
                  w={92}
                  h={28}
                  color="green.8"
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: "100px",
                  }}
                >
                  <Text c={"FFFFFF"} size="sm" fw={600} fz={"sm"}>
                    {table.status}
                  </Text>
                </Badge>
                <Flex
                  bg={table.id === tableId ? "#30444F" : "white"}
                  mt={"12"}
                  direction="column"
                  align="center"
                  justify="center"
                  style={{
                    height: "100px",
                    width: "120px",
                    borderRadius: "8px",
                    border: "1px solid #BFC5C8",
                  }}
                >
                  <Center>
                    <Text
                      mt={"4"}
                      size="md"
                      weight={900}
                      mb={4}
                      c={table.id === tableId ? "white" : "black"}
                    >
                      Table - {table.id}
                    </Text>
                  </Center>
                  <Flex
                    gap={0}
                    h={28}
                    w={92}
                    justify={"center"}
                    align={"center"}
                    bg={table.id === tableId ? "white" : "#E6F5ED"}
                    style={{
                      borderRadius: "1px",
                    }}
                  >
                    <Text size="sm" fw={400} c={"black"}>
                      {table.time}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Group>
        </ScrollArea>
        {showLeftArrow && (
          <ActionIcon
            variant="filled"
            color="gray"
            radius="xl"
            size="lg"
            h={48}
            w={48}
            style={{
              position: "absolute",
              left: 5,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => scroll("left")}
          >
            <IconChevronLeft size={26} />
          </ActionIcon>
        )}
        {showRightArrow && (
          <ActionIcon
            variant="filled"
            color="gray"
            radius="xl"
            size="lg"
            h={48}
            w={48}
            style={{
              position: "absolute",
              right: 5,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() => scroll("right")}
          >
            <IconChevronRight size={26} />
          </ActionIcon>
        )}
      </Box>
    </>
  );
}

export default HeaderNavbar;
