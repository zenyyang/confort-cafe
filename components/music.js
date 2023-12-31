import { useEffect, useState } from "react";
import {
  useColorModeValue,
  useMediaQuery,
  IconButton,
  Box,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  MdGraphicEq,
  HStack,
} from "@chakra-ui/react";
import Image from "next/image";
import styled from "@emotion/styled";

const LogoBox = styled.span`
  font-weight: bold;
  display: inline-flex;
  font-size: 14px;
  align-items: center;
  height: 30px;
  padding: 10px;
`;

const AudioPlayer = ({ tracks }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = tracks[currentTrackIndex];
  const [volume, setVolume] = useState(0.5); // Initial volume
  const [currentTime, setCurrentTime] = useState(0); // Current time of the track
  const [duration, setDuration] = useState(0); // Total duration of the track
  const [isLgScreen] = useMediaQuery("(min-width: 480px)"); // Customize the breakpoint as needed

  const handlePlayNext = () => {
    console.log(isPlaying);
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);

    const audioElement = document.getElementById("audio-player");
    audioElement.play(); // Auto play the next track
    setIsPlaying(true);
  };

  const handleTrackEnded = () => {
    handlePlayNext();
  };

  const handleVolumeChange = (newVolume) => {
    const audioElement = document.getElementById("audio-player");
    const newVol = parseFloat(newVolume);
    audioElement.volume = newVol;
    setVolume(newVol);
  };

  const handleTimeUpdate = () => {
    const audioElement = document.getElementById("audio-player");
    setCurrentTime(audioElement.currentTime);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePauseAndPlay = () => {
    const audioElement = document.getElementById("audio-player");
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audioElement = document.getElementById("audio-player");
    audioElement.addEventListener("ended", handleTrackEnded);
    audioElement.volume = volume; // Set initial volume
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    // setIsPlaying(true); // Start playing the first track
    audioElement.play(); // Auto play the first track

    return () => {
      audioElement.removeEventListener("ended", handleTrackEnded);
    };
  }, [currentTrackIndex, volume]);

  useEffect(() => {
    const audioElement = document.getElementById("audio-player");
    audioElement.addEventListener("durationchange", () => {
      setDuration(audioElement.duration);
    });
  }, []);

  return (
    <Box align="left" mt={16}>
      <Flex justifyContent="space-between">
        <Flex>
          <IconButton
            aria-label="Toggle theme"
            colorScheme={useColorModeValue("yellow", "pink")}
            onClick={togglePauseAndPlay}
          >
            {isPlaying ? (
              <Image
                src={`/images/pause.png`}
                width={12}
                height={10}
                alt="logo"
              ></Image>
            ) : (
              <Image
                src={`/images/play.png`}
                width={12}
                height={10}
                alt="logo"
              ></Image>
            )}
          </IconButton>
          <IconButton
            aria-label="Toggle theme"
            ml={3}
            colorScheme={useColorModeValue("yellow", "pink")}
            onClick={handlePlayNext}
          >
            <Image
              src={`/images/next.png`}
              width={12}
              height={10}
              alt="logo"
            ></Image>
          </IconButton>
        </Flex>
        {isLgScreen ? ( // Check if the screen size is lg
          <LogoBox>
            <Text
              mt={2}
              fontFamily='M PLUS Rounded 1c", sans-serif'
              fontWeight="bold"
            >
              Now playing : {currentTrack.slice(0, -4)}
            </Text>
          </LogoBox>
        ) : (
          <LogoBox>
            <Text
              align="center"
              mt={2}
              fontFamily='M PLUS Rounded 1c", sans-serif'
              fontWeight="bold"
            >
              {currentTrack.slice(0, -4)}
            </Text>
          </LogoBox>
        )}
        <Slider
          mr={3}
          maxW={100}
          aria-label="slider-ex-4"
          colorScheme={useColorModeValue("yellow", "pink")}
          defaultValue={0.5}
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
        >
          <SliderTrack bg="gray.200">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={4}>
            <Box color="tomato" as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
      </Flex>
      <Flex mt={4} justifyContent="space-between">
        <LogoBox>
          <Text fontFamily='M PLUS Rounded 1c", sans-serif' fontWeight="bold">
            {formatTime(currentTime)}
          </Text>
        </LogoBox>
        <Slider
          maxW={[200, 400, 400]}
          aria-label="slider-ex-4"
          colorScheme={useColorModeValue("yellow", "pink")}
          defaultValue={0}
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={(value) => {
            const audioElement = document.getElementById("audio-player");
            audioElement.currentTime = value;
            setCurrentTime(value);
          }}
        >
          <SliderTrack bg="gray.200">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={4}>
            <Box color="tomato" as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
        <LogoBox>
          <Text fontFamily='M PLUS Rounded 1c", sans-serif' fontWeight="bold">
            {formatTime(duration - currentTime)}
          </Text>
        </LogoBox>
      </Flex>
      <audio id="audio-player" src={`/music/${currentTrack}`} />
    </Box>
  );
};

const tracks = [
  "bert - coastline.mp3",
  "doolie x dao - sincere.mp3",
  "hikari - idyllic delight.mp3",
  "lakey - me2.mp3",
  "lofi fruit - chilling tokyo.mp3",
  "lofi fruit - heat wave.mp3",
  "lofi fruit - i'm yours.mp3",
  "lofi fruit - yellow.mp3",
  "r6 postmatch lofi.mp3",
  "mix up lofi.mp3",
]; // List your track filenames here

export default function Home() {
  return (
    <Box>
      <AudioPlayer tracks={tracks}></AudioPlayer>
    </Box>
  );
}
