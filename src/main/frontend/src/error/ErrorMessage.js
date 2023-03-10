import styled from "styled-components";
import { EColor } from "../styles/HarmonyColors";
import { HarmonyFonts } from "../styles/HarmonyFonts.js";
import ErrorIllustration from "../svg/ErrorIllustration.svg.jsx";

const ErrorMessage = () => {
  return (
    <>
      <HarmonyFonts />
      <Container>
        <ErrorMessageWrapper>
          <div>
            <h3>Something's not working. Please try again later. </h3>
            <p>
              If the issue persists, contact{" "}
              <a
                href="http://support.lumenlearning.com/"
                rel="noreferrer"
                target="_blank"
              >
                Lumen Support
              </a>
              .
            </p>
          </div>
          <ErrorIllustration />
        </ErrorMessageWrapper>
        <ErrorIllustrationAttribution>
          <a href="https://storyset.com/people">
            People Illustrations by Storyset
          </a>
        </ErrorIllustrationAttribution>
      </Container>
    </>
  );
};

const Container = styled.div`
  background-color: ${EColor.light_gray};
  padding-top: 40px;
  padding-right: 20px;
  padding-left: 20px;
`;

const ErrorMessageWrapper = styled.div`
  padding: 40px;
  background-color: ${EColor.white};
  border-radius: 10px;
  text-align: center;
  font-family: "Public Sans";
  display: grid;
  grid-gap: 20px;
  justify-content: center;

  svg {
    max-width: 100%;
    max-height: 378px;
  }

  a {
    background-image: linear-gradient(to right, #5367ea, #5367ea),
      linear-gradient(to right, #5367ea, #5367ea);
    background-position: 100% 100%, 0 100%;
    background-repeat: no-repeat;
    background-size: 0 0.075em, 100% 0.075em;
    color: ${EColor.indigo_500};
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: all 150ms;
    &:hover,
    &:focus {
      color: ${EColor.grape_600};
      background-image: linear-gradient(to right, #5367ea, #5367ea),
        linear-gradient(to right, #5367ea 30%, #4252bb 70%, #330675);
      background-position: 100% 100%, 0 100%;
      background-size: 0 0.075em, 100% 0.15em;
    }
    &:focus {
      outline: 2px solid ${EColor.white};
      box-shadow: 0px 0px 0px 4px ${EColor.primary_text};
    }
  }

  p {
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
  }
`;

const ErrorIllustrationAttribution = styled.div`
  margin-top: 20px;
  text-align: right;

  a {
    color: ${EColor.secondary_text};
  }
`;

export { ErrorMessage };